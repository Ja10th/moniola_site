const pool = require('../config/db');
const crypto = require('crypto');

// School stats for admin dashboard
const getStats = async (req, res) => {
  const school_id = req.user.school_id;
  try {
    const [studentsRes, teachersRes, classesRes, pendingGradesRes, publishedRes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM students WHERE school_id = $1 AND is_active = TRUE', [school_id]),
      pool.query("SELECT COUNT(*) FROM users WHERE school_id = $1 AND role = 'teacher'", [school_id]),
      pool.query('SELECT COUNT(*) FROM classes WHERE school_id = $1', [school_id]),
      pool.query(`SELECT COUNT(*) FROM grades g
                  JOIN students s ON g.student_id = s.id
                  WHERE s.school_id = $1 AND g.is_approved = FALSE`, [school_id]),
      pool.query(`SELECT COUNT(*) FROM grades g
                  JOIN students s ON g.student_id = s.id
                  WHERE s.school_id = $1 AND g.is_approved = TRUE`, [school_id]),
    ]);
    const passRateRes = await pool.query(`
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE g.total_score >= 40) * 100.0) / NULLIF(COUNT(*), 0), 1
      ) as pass_rate
      FROM grades g JOIN students s ON g.student_id = s.id
      WHERE s.school_id = $1 AND g.is_approved = TRUE
    `, [school_id]);

    res.json({
      success: true,
      data: {
        total_students: parseInt(studentsRes.rows[0].count),
        total_teachers: parseInt(teachersRes.rows[0].count),
        total_classes: parseInt(classesRes.rows[0].count),
        pending_grades: parseInt(pendingGradesRes.rows[0].count),
        approved_grades: parseInt(publishedRes.rows[0].count),
        pass_rate: parseFloat(passRateRes.rows[0]?.pass_rate || 0),
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};

// Get class broadsheet
const getBroadsheet = async (req, res) => {
  const { class_id, session_id, term_id } = req.query;
  try {
    // Students
    const studentsRes = await pool.query(
      'SELECT id, admission_number, first_name, last_name, gender FROM students WHERE class_id = $1 AND is_active = TRUE ORDER BY last_name, first_name',
      [class_id]
    );
    // Subjects for class
    const subjectsRes = await pool.query(
      'SELECT sub.id, sub.name, sub.code FROM class_subjects cs JOIN subjects sub ON cs.subject_id = sub.id WHERE cs.class_id = $1 ORDER BY sub.name',
      [class_id]
    );
    // All grades for this class/session/term
    const gradesRes = await pool.query(
      'SELECT g.student_id, g.subject_id, g.ca1, g.ca2, g.assignment, g.exam, g.total_score, g.grade FROM grades g WHERE g.class_id = $1 AND g.session_id = $2 AND g.term_id = $3',
      [class_id, session_id, term_id]
    );
    // Build grade map
    const gradeMap = {};
    for (const g of gradesRes.rows) {
      if (!gradeMap[g.student_id]) gradeMap[g.student_id] = {};
      gradeMap[g.student_id][g.subject_id] = g;
    }
    // Compute totals and positions
    const students = studentsRes.rows.map(s => {
      const subjectGrades = subjectsRes.rows.map(sub => gradeMap[s.id]?.[sub.id] || null);
      const scores = subjectGrades.filter(g => g).map(g => parseFloat(g.total_score));
      const totalScore = scores.reduce((a, b) => a + b, 0);
      const average = scores.length ? +(totalScore / scores.length).toFixed(2) : 0;
      return { ...s, grades: subjectGrades, total_score: totalScore, average };
    });
    students.sort((a, b) => b.average - a.average);
    students.forEach((s, i) => s.position = i + 1);

    res.json({
      success: true,
      data: { students, subjects: subjectsRes.rows, class_id, session_id, term_id }
    });
  } catch (err) {
    console.error('Broadsheet error:', err);
    res.status(500).json({ success: false, message: 'Error generating broadsheet' });
  }
};

// Approve grades
const approveGrades = async (req, res) => {
  const { class_id, session_id, term_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE grades SET is_approved = TRUE, approved_by = $1, approved_at = NOW() WHERE class_id = $2 AND session_id = $3 AND term_id = $4 AND is_approved = FALSE',
      [req.user.id, class_id, session_id, term_id]
    );
    res.json({ success: true, message: `${result.rowCount} grade(s) approved successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error approving grades' });
  }
};

// Publish term results
const publishResults = async (req, res) => {
  const { term_id } = req.body;
  try {
    await pool.query('UPDATE terms SET results_published = TRUE WHERE id = $1', [term_id]);
    res.json({ success: true, message: 'Results published successfully! Parents can now view results.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error publishing results' });
  }
};

// Generate result PINs for a class
const generatePINs = async (req, res) => {
  const { class_id, session_id, term_id, count } = req.body;
  const school_id = req.user.school_id;
  try {
    const studentsRes = await pool.query(
      'SELECT id, admission_number FROM students WHERE class_id = $1 AND is_active = TRUE',
      [class_id]
    );
    const pins = [];
    let serialIndex = Date.now();
    for (const student of studentsRes.rows) {
      // Check if PIN already exists
      const existingPin = await pool.query(
        'SELECT id FROM result_pins WHERE student_id = $1 AND session_id = $2 AND term_id = $3',
        [student.id, session_id, term_id]
      );
      if (existingPin.rows.length > 0) continue;

      const pinCode = generatePINCode();
      const serial = `UIC-${String(serialIndex++).slice(-6)}`;
      await pool.query(
        'INSERT INTO result_pins (id, school_id, serial_number, pin_code, student_id, session_id, term_id, generated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [crypto.randomUUID(), school_id, serial, pinCode, student.id, session_id, term_id, req.user.id]
      );
      pins.push({ admission_number: student.admission_number, serial, pin_code: pinCode });
    }
    res.json({ success: true, message: `${pins.length} PIN(s) generated`, data: pins });
  } catch (err) {
    console.error('PIN generation error:', err);
    res.status(500).json({ success: false, message: 'Error generating PINs' });
  }
};

// Get all PINs for a class
const getPINs = async (req, res) => {
  const { class_id, session_id, term_id } = req.query;
  try {
    const result = await pool.query(`
      SELECT rp.serial_number, rp.pin_code, rp.is_used, rp.usage_count, rp.max_uses, rp.created_at,
             s.admission_number, s.first_name, s.last_name
      FROM result_pins rp
      JOIN students s ON rp.student_id = s.id
      WHERE s.class_id = $1 AND rp.session_id = $2 AND rp.term_id = $3
      ORDER BY s.last_name, s.first_name
    `, [class_id, session_id, term_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching PINs' });
  }
};

// Manage students
const getStudents = async (req, res) => {
  const { class_id } = req.query;
  const school_id = req.user.school_id;
  try {
    const query = class_id
      ? 'SELECT s.*, c.name as class_name FROM students s JOIN classes c ON s.class_id = c.id WHERE s.school_id = $1 AND s.class_id = $2 AND s.is_active = TRUE ORDER BY s.last_name, s.first_name'
      : 'SELECT s.*, c.name as class_name FROM students s JOIN classes c ON s.class_id = c.id WHERE s.school_id = $1 AND s.is_active = TRUE ORDER BY c.level, s.last_name';
    const params = class_id ? [school_id, class_id] : [school_id];
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching students' });
  }
};

const addStudent = async (req, res) => {
  const { admission_number, first_name, last_name, middle_name, gender, date_of_birth, class_id } = req.body;
  const school_id = req.user.school_id;
  try {
    const existing = await pool.query('SELECT id FROM students WHERE admission_number = $1', [admission_number]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Admission number already exists' });
    }
    const result = await pool.query(
      'INSERT INTO students (id, school_id, admission_number, first_name, last_name, middle_name, gender, date_of_birth, class_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [crypto.randomUUID(), school_id, admission_number.toUpperCase(), first_name, last_name, middle_name, gender, date_of_birth, class_id]
    );
    res.status(201).json({ success: true, message: 'Student added successfully', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding student' });
  }
};

function generatePINCode() {
  const segment = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${segment()}-${segment()}-${segment()}`;
}

module.exports = {
  getStats, getBroadsheet, approveGrades, publishResults,
  generatePINs, getPINs, getStudents, addStudent
};
