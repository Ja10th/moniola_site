/**
 * Database Seed Script for Moniola Laurels Educational School
 * Run: node database/seed.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

function generatePIN() {
  const segment = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${segment()}-${segment()}-${segment()}`;
}

function generateSerial(index) {
  return `MLES-${String(index).padStart(6, '0')}`;
}

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting database seed for Moniola Laurels Educational School...');

    // 1. Run schema
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Schema applied');

    // Clear existing data
    await client.query('TRUNCATE schools, sessions, terms, users, classes, subjects, class_subjects, students, grades, psychomotor, result_pins, pin_usage_log RESTART IDENTITY CASCADE');

    // ────────────────────────────────
    // 2. School - Moniola Laurels Educational School
    // ────────────────────────────────
    const schoolId = uuidv4();
    await client.query(`
      INSERT INTO schools (id, name, motto, address, phone, email, principal_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      schoolId,
      'Moniola Laurels Educational School',
      'Knowledge, Discipline & Character',
      '10 Moniola Laurels Close, Ikeja, Lagos State, Nigeria',
      '08031234567',
      'info@moniolalaurels.edu.ng',
      'Mrs. Moniola A. Adeleke'
    ]);
    console.log('✅ School seeded (Moniola Laurels Educational School)');

    // ────────────────────────────────
    // 3. Session & Terms
    // ────────────────────────────────
    const sessionId = uuidv4();
    await client.query(`
      INSERT INTO sessions (id, school_id, name, is_current) VALUES ($1, $2, $3, TRUE)
    `, [sessionId, schoolId, '2024/2025']);

    const term1Id = uuidv4();
    const term2Id = uuidv4();
    const term3Id = uuidv4();
    await client.query(`INSERT INTO terms (id, session_id, name, term_number, start_date, end_date, resumption_date, is_current, results_published)
      VALUES ($1, $2, '1st Term', 1, '2024-09-10', '2024-12-06', '2025-01-13', FALSE, TRUE),
             ($3, $2, '2nd Term', 2, '2025-01-13', '2025-03-28', '2025-04-28', TRUE, FALSE),
             ($4, $2, '3rd Term', 3, '2025-04-28', '2025-07-18', NULL, FALSE, FALSE)`,
      [term1Id, sessionId, term2Id, term3Id]);
    console.log('✅ Session and Terms seeded');

    // ────────────────────────────────
    // 4. Users (Admin + Teachers)
    // ────────────────────────────────
    const adminHash = await bcrypt.hash('Admin@2024', 10);
    const teacherHash = await bcrypt.hash('Teacher@2024', 10);

    const adminId = uuidv4();
    const teacherIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];

    await client.query(`
      INSERT INTO users (id, school_id, full_name, email, password_hash, role) VALUES
      ($1, $2, 'Mrs. Moniola A. Adeleke', 'admin@moniolalaurels.edu.ng', $3, 'admin')
    `, [adminId, schoolId, adminHash]);

    const teachers = [
      [teacherIds[0], 'Mr. Chukwuemeka Nwosu', 'c.nwosu@moniolalaurels.edu.ng'],
      [teacherIds[1], 'Mrs. Folake Adeyemi', 'f.adeyemi@moniolalaurels.edu.ng'],
      [teacherIds[2], 'Mr. Ibrahim Musa', 'i.musa@moniolalaurels.edu.ng'],
      [teacherIds[3], 'Miss Ngozi Eze', 'n.eze@moniolalaurels.edu.ng'],
      [teacherIds[4], 'Mr. Tunde Bakare', 't.bakare@moniolalaurels.edu.ng'],
      [teacherIds[5], 'Mrs. Grace Okafor', 'g.okafor@moniolalaurels.edu.ng'],
    ];
    for (const [tid, name, email] of teachers) {
      await client.query(`INSERT INTO users (id, school_id, full_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5, 'teacher')`,
        [tid, schoolId, name, email, teacherHash]);
    }
    console.log('✅ Users seeded (1 admin + 6 teachers)');

    // ────────────────────────────────
    // 5. Classes
    // ────────────────────────────────
    const classes = [
      { name: 'JSS 1A', level: 'JSS1', section: 'A', teacher: teacherIds[0] },
      { name: 'JSS 2A', level: 'JSS2', section: 'A', teacher: teacherIds[1] },
      { name: 'JSS 3A', level: 'JSS3', section: 'A', teacher: teacherIds[2] },
      { name: 'SSS 1 Science', level: 'SSS1', section: 'Science', teacher: teacherIds[3] },
      { name: 'SSS 2 Science', level: 'SSS2', section: 'Science', teacher: teacherIds[4] },
      { name: 'SSS 1 Arts', level: 'SSS1', section: 'Arts', teacher: teacherIds[4] },
      { name: 'SSS 2 Commercial', level: 'SSS2', section: 'Commercial', teacher: teacherIds[5] },
    ];
    const classMap = {};
    for (const cls of classes) {
      const cid = uuidv4();
      classMap[cls.name] = cid;
      await client.query(`INSERT INTO classes (id, school_id, name, level, section, form_teacher_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [cid, schoolId, cls.name, cls.level, cls.section, cls.teacher]);
    }
    console.log('✅ Classes seeded');

    // ────────────────────────────────
    // 6. Subjects
    // ────────────────────────────────
    const subjectData = [
      ['English Studies', 'ENGS', 'Junior'],
      ['Mathematics', 'MTH', 'Junior'],
      ['Physical and Health Education', 'PHE', 'Junior'],
      ['Christian Religious Studies', 'CRS', 'Junior'],
      ['Livestock Farming', 'LIV', 'Junior'],
      ['Nigerian History', 'NHI', 'Junior'],
      ['Social and Citizenship Studies', 'SCS', 'Junior'],
      ['Cultural and Creative Arts', 'CCA', 'Junior'],
      ['French', 'FRN', 'Junior'],
      ['Intermediate Science', 'SCI', 'Junior'],
      ['Digital Technologies', 'DGT', 'Junior'],
      ['Business Studies', 'BST', 'Junior'],
      ['Music', 'MUS', 'Junior'],
      ['Phonics', 'PHN', 'Junior'],
      ['English Language', 'ENL', 'Senior Core'],
      ['General Mathematics', 'GMA', 'Senior Core'],
      ['Citizenship and Heritage Studies', 'CHS', 'Senior Core'],
      ['Digital Technologies', 'DGTS', 'Senior Core'],
      ['Biology', 'BIO', 'Senior Science'],
      ['Chemistry', 'CHM', 'Senior Science'],
      ['Physics', 'PHY', 'Senior Science'],
      ['Agriculture', 'AGR', 'Senior Science'],
      ['Further Mathematics', 'FMA', 'Senior Science'],
      ['Livestock Farming', 'LIVS', 'Senior Science'],
      ['Geography', 'GEO', 'Senior Science'],
      ['Phonics', 'PHNS', 'Senior Science'],
      ['Government', 'GOV', 'Senior Arts'],
      ['Christian Religious Studies', 'CRSA', 'Senior Arts'],
      ['Visual Arts', 'VAS', 'Senior Arts'],
      ['Literature in English', 'LIT', 'Senior Arts'],
      ['Accounting', 'ACC', 'Senior Commercial'],
      ['Economics', 'ECO', 'Senior Commercial'],
      ['Commerce', 'COM', 'Senior Commercial'],
    ];
    const subjectMap = {};
    for (const [name, code, category] of subjectData) {
      const sid = uuidv4();
      subjectMap[code] = sid;
      await client.query(`INSERT INTO subjects (id, school_id, name, code, category) VALUES ($1, $2, $3, $4, $5)`,
        [sid, schoolId, name, code, category]);
    }
    console.log('✅ Subjects seeded');

    // ────────────────────────────────
    // 7. Class Subjects (linking)
    // ────────────────────────────────
    const juniorSubjectCodes = ['ENGS','MTH','PHE','CRS','LIV','NHI','SCS','CCA','FRN','SCI','DGT','BST','MUS','PHN'];
    const jss1Id = classMap['JSS 1A'];
    const jss2Id = classMap['JSS 2A'];
    const jss3Id = classMap['JSS 3A'];
    const sss1SciId = classMap['SSS 1 Science'];
    const sss2SciId = classMap['SSS 2 Science'];
    const sss1ArtsId = classMap['SSS 1 Arts'];
    const sss2ComId = classMap['SSS 2 Commercial'];

    for (const code of juniorSubjectCodes) {
      for (const cid of [jss1Id, jss2Id, jss3Id]) {
        await client.query(`INSERT INTO class_subjects (id, class_id, subject_id, teacher_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
          [uuidv4(), cid, subjectMap[code], teacherIds[Math.floor(Math.random() * 3)]]);
      }
    }
    const seniorScienceCodes = ['ENL','GMA','CHS','DGTS','BIO','CHM','PHY','AGR','FMA','LIVS','GEO','PHNS'];
    for (const code of seniorScienceCodes) {
      for (const cid of [sss1SciId, sss2SciId]) {
        await client.query(`INSERT INTO class_subjects (id, class_id, subject_id, teacher_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
          [uuidv4(), cid, subjectMap[code], teacherIds[3 + Math.floor(Math.random() * 3)]]);
      }
    }
    const seniorArtsCodes = ['ENL','GMA','CHS','DGTS','AGR','LIVS','GOV','CRSA','VAS','LIT','PHNS'];
    for (const code of seniorArtsCodes) {
      await client.query(`INSERT INTO class_subjects (id, class_id, subject_id, teacher_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [uuidv4(), sss1ArtsId, subjectMap[code], teacherIds[4]]);
    }
    const seniorComCodes = ['ENL','GMA','CHS','DGTS','AGR','LIVS','ACC','ECO','COM'];
    for (const code of seniorComCodes) {
      await client.query(`INSERT INTO class_subjects (id, class_id, subject_id, teacher_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [uuidv4(), sss2ComId, subjectMap[code], teacherIds[5]]);
    }

    // ────────────────────────────────
    // 8. Students
    // ────────────────────────────────
    const studentData = [
      { admNo: 'MLES/2024/JSS1/001', first: 'Chidera', last: 'Okafor', gender: 'Male', class: 'JSS 1A' },
      { admNo: 'MLES/2024/JSS1/002', first: 'Adaeze', last: 'Nwosu', gender: 'Female', class: 'JSS 1A' },
      { admNo: 'MLES/2024/JSS1/003', first: 'Emeka', last: 'Eze', gender: 'Male', class: 'JSS 1A' },
      { admNo: 'MLES/2024/JSS1/004', first: 'Fatima', last: 'Aliyu', gender: 'Female', class: 'JSS 1A' },
      { admNo: 'MLES/2024/JSS1/005', first: 'Toba', last: 'Adewale', gender: 'Male', class: 'JSS 1A' },
      { admNo: 'MLES/2024/JSS1/006', first: 'Chinyere', last: 'Obi', gender: 'Female', class: 'JSS 1A' },
      { admNo: 'MLES/2024/JSS1/007', first: 'Abubakar', last: 'Suleiman', gender: 'Male', class: 'JSS 1A' },
      { admNo: 'MLES/2024/JSS1/008', first: 'Blessing', last: 'Effiong', gender: 'Female', class: 'JSS 1A' },
      { admNo: 'MLES/2023/JSS2/001', first: 'Oluwaseun', last: 'Bamidele', gender: 'Male', class: 'JSS 2A' },
      { admNo: 'MLES/2023/JSS2/002', first: 'Amara', last: 'Chukwu', gender: 'Female', class: 'JSS 2A' },
      { admNo: 'MLES/2022/SSS1/001', first: 'Babatunde', last: 'Olawale', gender: 'Male', class: 'SSS 1 Science' },
      { admNo: 'MLES/2021/SSS2/001', first: 'Tope', last: 'Adeleke', gender: 'Male', class: 'SSS 2 Science' },
    ];

    const studentIds = {};
    for (const s of studentData) {
      const sid = uuidv4();
      studentIds[s.admNo] = sid;
      await client.query(`INSERT INTO students (id, school_id, admission_number, first_name, last_name, gender, class_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [sid, schoolId, s.admNo, s.first, s.last, s.gender, classMap[s.class]]);
    }
    console.log(`✅ Students seeded (${studentData.length} students)`);

    // ────────────────────────────────
    // 9. Grades (1st Term - Published)
    // ────────────────────────────────
    const jss1Students = studentData.filter(s => s.class === 'JSS 1A');
    const jss1SubjectCodes = ['ENG','MTH','BSC','BTC','AGR','CIV','SST','CRS','CMP','PHE'];
    const randomScore = (min, max) => +(min + Math.random() * (max - min)).toFixed(1);

    for (const student of jss1Students) {
      for (const code of jss1SubjectCodes) {
        const ca1 = randomScore(8, 15);
        const ca2 = randomScore(8, 15);
        const assignment = randomScore(6, 10);
        const exam = randomScore(30, 58);
        await client.query(`
          INSERT INTO grades (id, student_id, subject_id, class_id, session_id, term_id, ca1, ca2, assignment, exam, is_approved, uploaded_by, approved_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE, $11, $11)
        `, [uuidv4(), studentIds[student.admNo], subjectMap[code], jss1Id, sessionId, term1Id, ca1, ca2, assignment, exam, adminId]);
      }
      await client.query(`
        INSERT INTO psychomotor (id, student_id, class_id, session_id, term_id, punctuality, neatness, politeness, honesty, leadership, cooperation, sports_games, handwork_crafts, drawing_painting, days_present, days_opened, class_teacher_remark, principal_remark, next_term_begins, entered_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, '2025-01-13', $19)
      `, [uuidv4(), studentIds[student.admNo], jss1Id, sessionId, term1Id,
          4, 5, 5, 4, 4, 5, 4, 3, 4,
          62, 68,
          'A diligent and focused student. Keep it up!',
          'Good performance. Show more dedication next term.',
          adminId
        ]);
    }

    console.log('✅ Grades seeded (1st Term results)');

    // ────────────────────────────────
    // 10. Result PINs
    // ────────────────────────────────
    let pinIndex = 1;
    for (const student of studentData) {
      await client.query(`
        INSERT INTO result_pins (id, school_id, serial_number, pin_code, student_id, session_id, term_id, generated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [uuidv4(), schoolId, generateSerial(pinIndex++), generatePIN(), studentIds[student.admNo], sessionId, term1Id, adminId]);
    }
    console.log('✅ Result PINs generated');

    console.log('\n🎉 Seed complete for Moniola Laurels Educational School!');
    console.log('   Admin:   admin@moniolalaurels.edu.ng  | Password: Admin@2024');
    console.log('   Teacher: c.nwosu@moniolalaurels.edu.ng | Password: Teacher@2024\n');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
