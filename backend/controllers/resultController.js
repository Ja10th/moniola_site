const pool = require('../config/db');

// ─────────────────────────────────────────────
// PUBLIC: Check result via Admission No + PIN
// ─────────────────────────────────────────────
const checkResult = async (req, res) => {
  const { admission_number, pin_code, session_name, term_number } = req.body;
  if (!admission_number || !pin_code) {
    return res.status(400).json({ success: false, message: 'Admission number and PIN are required' });
  }
  try {
    // 1. Find student
    const studentRes = await pool.query(
      `SELECT s.*, c.name as class_name, c.level, c.section, sc.name as school_name, sc.motto, sc.address, sc.principal_name, sc.logo_url
       FROM students s
       JOIN classes c ON s.class_id = c.id
       JOIN schools sc ON s.school_id = sc.id
       WHERE s.admission_number = $1 AND s.is_active = TRUE`,
      [admission_number.toUpperCase()]
    );
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found. Check your admission number.' });
    }
    const student = studentRes.rows[0];

    // 2. Find session & term
    const sessionRes = await pool.query(
      `SELECT s.id as session_id, s.name as session_name, t.id as term_id, t.name as term_name, t.term_number, t.resumption_date, t.results_published
       FROM sessions s
       JOIN terms t ON t.session_id = s.id
       WHERE s.school_id = $1 AND ($2::VARCHAR IS NULL OR s.name = $2) AND ($3::INT IS NULL OR t.term_number = $3)
       ORDER BY s.name DESC, t.term_number ASC
       LIMIT 1`,
      [student.school_id, session_name || null, term_number ? parseInt(term_number) : null]
    );
    if (sessionRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session/Term not found.' });
    }
    const sessionTerm = sessionRes.rows[0];
    if (!sessionTerm.results_published) {
      return res.status(403).json({ success: false, message: 'Results for this term have not been published yet. Please check back later.' });
    }

    // 3. Validate PIN
    const pinRes = await pool.query(
      `SELECT * FROM result_pins WHERE pin_code = $1 AND student_id = $2 AND session_id = $3 AND term_id = $4`,
      [pin_code.toUpperCase(), student.id, sessionTerm.session_id, sessionTerm.term_id]
    );
    if (pinRes.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Invalid PIN for this student or term.' });
    }
    const pin = pinRes.rows[0];
    if (pin.usage_count >= pin.max_uses) {
      return res.status(403).json({ success: false, message: `This PIN has been used the maximum number of times (${pin.max_uses}).` });
    }

    // 4. Update PIN usage
    await pool.query(
      `UPDATE result_pins SET usage_count = usage_count + 1, is_used = TRUE, first_used_at = COALESCE(first_used_at, NOW()) WHERE id = $1`,
      [pin.id]
    );
    await pool.query(
      `INSERT INTO pin_usage_log (id, pin_id, ip_address) VALUES ($1, $2, $3)`,
      [require('crypto').randomUUID(), pin.id, req.ip]
    );

    // 5. Fetch grades
    const gradesRes = await pool.query(
      `SELECT g.ca1, g.ca2, g.assignment, g.exam, g.total_score, g.grade, g.grade_remark,
              sub.name as subject_name, sub.code as subject_code
       FROM grades g
       JOIN subjects sub ON g.subject_id = sub.id
       WHERE g.student_id = $1 AND g.session_id = $2 AND g.term_id = $3 AND g.is_approved = TRUE
       ORDER BY sub.name`,
      [student.id, sessionTerm.session_id, sessionTerm.term_id]
    );

    // 6. Fetch psychomotor
    const psychoRes = await pool.query(
      `SELECT * FROM psychomotor WHERE student_id = $1 AND session_id = $2 AND term_id = $3`,
      [student.id, sessionTerm.session_id, sessionTerm.term_id]
    );

    // 7. Class performance stats
    const statsRes = await pool.query(
      `SELECT
          COUNT(DISTINCT g.student_id) as class_size,
          AVG(sub_totals.avg_score) as class_average
       FROM grades g
       JOIN (
         SELECT student_id, AVG(total_score) as avg_score
         FROM grades
         WHERE class_id = $1 AND session_id = $2 AND term_id = $3 AND is_approved = TRUE
         GROUP BY student_id
       ) sub_totals ON g.student_id = sub_totals.student_id
       WHERE g.class_id = $1 AND g.session_id = $2 AND g.term_id = $3`,
      [student.class_id, sessionTerm.session_id, sessionTerm.term_id]
    );

    // 8. Student rank
    const rankRes = await pool.query(
      `SELECT student_id, AVG(total_score) as avg_score,
              RANK() OVER (ORDER BY AVG(total_score) DESC) as position
       FROM grades
       WHERE class_id = $1 AND session_id = $2 AND term_id = $3 AND is_approved = TRUE
       GROUP BY student_id`,
      [student.class_id, sessionTerm.session_id, sessionTerm.term_id]
    );
    const myRank = rankRes.rows.find(r => r.student_id === student.id);
    const studentAvg = gradesRes.rows.length
      ? gradesRes.rows.reduce((acc, g) => acc + parseFloat(g.total_score || 0), 0) / gradesRes.rows.length
      : 0;

    res.json({
      success: true,
      data: {
        student: {
          id: student.id,
          admission_number: student.admission_number,
          full_name: `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.trim(),
          first_name: student.first_name,
          last_name: student.last_name,
          gender: student.gender,
          class_name: student.class_name,
          level: student.level,
          passport_url: student.passport_url,
        },
        school: {
          name: student.school_name,
          motto: student.motto,
          address: student.address,
          principal_name: student.principal_name,
          logo_url: student.logo_url,
        },
        session: {
          name: sessionTerm.session_name,
          term_name: sessionTerm.term_name,
          term_number: sessionTerm.term_number,
          resumption_date: sessionTerm.resumption_date,
        },
        grades: gradesRes.rows,
        psychomotor: psychoRes.rows[0] || null,
        performance: {
          student_average: +studentAvg.toFixed(2),
          class_size: statsRes.rows[0]?.class_size || 0,
          class_average: +(parseFloat(statsRes.rows[0]?.class_average) || 0).toFixed(2),
          position: myRank?.position || null,
          total_score: gradesRes.rows.reduce((acc, g) => acc + parseFloat(g.total_score || 0), 0),
          subjects_count: gradesRes.rows.length,
        }
      }
    });
  } catch (err) {
    console.error('Check result error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching results' });
  }
};

// ─────────────────────────────────────────────
// TEACHER: Upload grades for a class/subject
// ─────────────────────────────────────────────
const uploadGrades = async (req, res) => {
  const { class_id, subject_id, session_id, term_id, grades } = req.body;
  if (!class_id || !subject_id || !session_id || !term_id || !Array.isArray(grades)) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const g of grades) {
        const { student_id, ca1 = 0, ca2 = 0, assignment = 0, exam = 0 } = g;
        await client.query(`
          INSERT INTO grades (id, student_id, subject_id, class_id, session_id, term_id, ca1, ca2, assignment, exam, uploaded_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (student_id, subject_id, session_id, term_id)
          DO UPDATE SET ca1 = $7, ca2 = $8, assignment = $9, exam = $10, uploaded_by = $11, uploaded_at = NOW(), is_approved = FALSE
        `, [require('crypto').randomUUID(), student_id, subject_id, class_id, session_id, term_id, ca1, ca2, assignment, exam, req.user.id]);
      }
      await client.query('COMMIT');
      res.json({ success: true, message: `Grades uploaded for ${grades.length} student(s)` });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Upload grades error:', err);
    res.status(500).json({ success: false, message: 'Error uploading grades' });
  }
};

// TEACHER: Upload psychomotor ratings
const uploadPsychomotor = async (req, res) => {
  const { student_id, class_id, session_id, term_id, ...ratings } = req.body;
  try {
    await pool.query(`
      INSERT INTO psychomotor (id, student_id, class_id, session_id, term_id,
        punctuality, neatness, politeness, honesty, leadership, cooperation,
        sports_games, handwork_crafts, drawing_painting,
        days_present, days_opened, class_teacher_remark, principal_remark, next_term_begins, entered_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      ON CONFLICT (student_id, session_id, term_id)
      DO UPDATE SET punctuality=$6, neatness=$7, politeness=$8, honesty=$9, leadership=$10,
        cooperation=$11, sports_games=$12, handwork_crafts=$13, drawing_painting=$14,
        days_present=$15, days_opened=$16, class_teacher_remark=$17, principal_remark=$18, next_term_begins=$19, entered_by=$20
    `, [
      require('crypto').randomUUID(), student_id, class_id, session_id, term_id,
      ratings.punctuality || 3, ratings.neatness || 3, ratings.politeness || 3,
      ratings.honesty || 3, ratings.leadership || 3, ratings.cooperation || 3,
      ratings.sports_games || 3, ratings.handwork_crafts || 3, ratings.drawing_painting || 3,
      ratings.days_present || 0, ratings.days_opened || 0,
      ratings.class_teacher_remark || '', ratings.principal_remark || '',
      ratings.next_term_begins || null, req.user.id
    ]);
    res.json({ success: true, message: 'Psychomotor ratings saved successfully' });
  } catch (err) {
    console.error('Psychomotor upload error:', err);
    res.status(500).json({ success: false, message: 'Error saving psychomotor data' });
  }
};

// TEACHER: Get class students with grades for a subject
const getClassSubjectGrades = async (req, res) => {
  const { class_id, subject_id, session_id, term_id } = req.query;
  try {
    const result = await pool.query(`
      SELECT s.id, s.admission_number, s.first_name, s.last_name,
             g.ca1, g.ca2, g.assignment, g.exam, g.total_score, g.grade, g.is_approved
      FROM students s
      LEFT JOIN grades g ON g.student_id = s.id AND g.subject_id = $2 AND g.session_id = $3 AND g.term_id = $4
      WHERE s.class_id = $1 AND s.is_active = TRUE
      ORDER BY s.last_name, s.first_name
    `, [class_id, subject_id, session_id, term_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching class grades' });
  }
};

// Get sessions and terms
const getSessionsAndTerms = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id as session_id, s.name as session_name, s.is_current,
             t.id as term_id, t.name as term_name, t.term_number, t.is_current as term_current, t.results_published
      FROM sessions s JOIN terms t ON t.session_id = s.id
      WHERE s.school_id = $1
      ORDER BY s.name DESC, t.term_number ASC
    `, [req.user.school_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching sessions' });
  }
};

// Get classes
const getClasses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.full_name as form_teacher_name
      FROM classes c LEFT JOIN users u ON c.form_teacher_id = u.id
      WHERE c.school_id = $1 ORDER BY c.level, c.section
    `, [req.user.school_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching classes' });
  }
};

// Get subjects for a class
const getSubjectsForClass = async (req, res) => {
  const { class_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT sub.*, u.full_name as teacher_name
      FROM class_subjects cs
      JOIN subjects sub ON cs.subject_id = sub.id
      LEFT JOIN users u ON cs.teacher_id = u.id
      WHERE cs.class_id = $1
      ORDER BY sub.name
    `, [class_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching subjects' });
  }
};

module.exports = {
  checkResult,
  uploadGrades,
  uploadPsychomotor,
  getClassSubjectGrades,
  getSessionsAndTerms,
  getClasses,
  getSubjectsForClass,
};
