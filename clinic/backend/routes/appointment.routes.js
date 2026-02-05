const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkUserRole, checkDoctorRole, checkAdminRole } = require('../middlewares/role.middleware');

// Bệnh nhân đặt lịch hẹn
router.post('/', verifyToken, checkUserRole, appointmentController.bookAppointment);

// Bệnh nhân xem lịch hẹn của mình
router.get('/my', verifyToken, checkUserRole, appointmentController.getUserAppointments);

// Bác sĩ xem lịch khám của mình
router.get('/doctor', verifyToken, checkDoctorRole, appointmentController.getDoctorAppointments);

// Quản lý xác nhận / hủy lịch
router.put('/:id/status', verifyToken, checkAdminRole, appointmentController.updateAppointmentStatus);
// Lấy tất cả lịch hẹn (admin)
router.get('/all', verifyToken, checkAdminRole, appointmentController.getAllAppointments);
//admin xóa lịch hẹn
router.delete('/:id', verifyToken, appointmentController.deleteAppointment);

// Public route (Để bệnh nhân thấy giờ nào đã bị đặt trước khi đăng nhập/đặt lịch)
router.get("/confirmed-times", appointmentController.getConfirmedTimes);

// Trong routes/appointment.routes.js (hoặc admin.routes.js)
router.put('/:id/payment', verifyToken, checkAdminRole, appointmentController.updatePaymentStatus);

module.exports = router;
