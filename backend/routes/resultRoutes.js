const express = require('express');
const router = express.Router();
const {
  checkResult, uploadGrades, uploadPsychomotor,
  getClassSubjectGrades, getSessionsAndTerms, getClasses, getSubjectsForClass
} = require('../controllers/resultController');
const { authMiddleware, teacherOrAdmin } = require('../middleware/auth');

// Public
router.post('/check', checkResult);

// Protected
router.get('/sessions', authMiddleware, getSessionsAndTerms);
router.get('/classes', authMiddleware, getClasses);
router.get('/classes/:class_id/subjects', authMiddleware, getSubjectsForClass);
router.get('/class-grades', authMiddleware, teacherOrAdmin, getClassSubjectGrades);
router.post('/upload', authMiddleware, teacherOrAdmin, uploadGrades);
router.post('/psychomotor', authMiddleware, teacherOrAdmin, uploadPsychomotor);

module.exports = router;
