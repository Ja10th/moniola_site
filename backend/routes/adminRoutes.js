const express = require('express');
const router = express.Router();
const {
  getStats, getBroadsheet, approveGrades, publishResults,
  generatePINs, getPINs, getStudents, addStudent
} = require('../controllers/adminController');
const { authMiddleware, adminOnly, teacherOrAdmin } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/broadsheet', teacherOrAdmin, getBroadsheet);
router.post('/grades/approve', adminOnly, approveGrades);
router.post('/results/publish', adminOnly, publishResults);
router.post('/pins/generate', adminOnly, generatePINs);
router.get('/pins', teacherOrAdmin, getPINs);
router.get('/students', teacherOrAdmin, getStudents);
router.post('/students', adminOnly, addStudent);

module.exports = router;
