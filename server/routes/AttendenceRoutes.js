const express = require('express');
const attendanceController = require('../controllers/attendenceController');
const checkRole = require('../middlewares/checkRole');
const authMiddleware = require('../middlewares/authMiddleware');
const restrictRole = require('../middlewares/restrictRole');

const router = express.Router();

router.get(
  '/employee-summary',
  authMiddleware.staffProtect,
  attendanceController.getEmployeeAttendanceSummary
);  


router.post(  
  '/attendance',
  authMiddleware.staffProtect,
  checkRole('HR || Manager'),
  attendanceController.createAttendance
);

router.patch(
  '/attendance',
  authMiddleware.staffProtect,
  checkRole(['HR',' Manager']),
  attendanceController.updateAttendance
)

router.get(
  '/attendance',
  authMiddleware.staffProtect,
  attendanceController.getAttendance
);

router.get(
  '/team-summary/:id',
  authMiddleware.staffProtect,
  restrictRole(['Manager', 'HR']),
  attendanceController.getTeamAttendanceSummary
);

router.get('/me/:id',
  authMiddleware.employeeProtect,
  attendanceController.getMyAttendance
);
router.get('/all-attendance',
  authMiddleware.staffProtect,
  checkRole(['HR','Manager']),
  attendanceController.getAllSummary
)

router.post('/attendancebyemail',authMiddleware.staffProtect, attendanceController.createAttendanceByemail)
router.delete('/attendancebyemail',authMiddleware.staffProtect, attendanceController.deleteAttendanceByemail)


module.exports = router;
