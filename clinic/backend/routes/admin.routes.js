const express = require('express');
const router = express.Router();

// Import Controller
const adminController = require('../controllers/admin.controller');

// Import Middlewares
const { verifyToken } = require('../middlewares/auth.middleware');
const { checkAdminRole } = require('../middlewares/role.middleware');
const { uploadDoctorImage } = require('../middlewares/uploadDoctor.middlewares'); 

// ==========================================
// 1. PUBLIC ROUTES (Không cần đăng nhập)
// ==========================================
router.post('/login', adminController.loginAdmin);

// ==========================================
// 2. PROTECTED ROUTES (Yêu cầu Token + Admin)
// ==========================================

// Áp dụng middleware xác thực cho tất cả các route bên dưới
router.use(verifyToken, checkAdminRole);

/**
 * @route   GET /api/admins/dashboard-stats
 */
router.get('/dashboard-stats', adminController.getDashboardStats);

// --- QUẢN LÝ BÁC SĨ ---

/**
 * @route   POST /api/admins/doctors
 */
router.post('/doctors', uploadDoctorImage.single('image'), adminController.createDoctor);

/**
 * @route   GET /api/admins/doctors
 */
router.get('/doctors', adminController.getAllDoctors);

/**
 * @route   PUT /api/admins/doctors/:id
 */
router.put('/doctors/:id', uploadDoctorImage.single('image'), adminController.updateDoctor);

/**
 * @route   DELETE /api/admins/doctors/:id
 */
router.delete('/doctors/:id', adminController.deleteDoctor);

/**
 * @route   PATCH /api/admins/doctors/:id/toggle
 * @note    Đã xóa các middleware thừa vì đã có router.use phía trên
 */
router.patch('/doctors/:id/toggle', adminController.changeAvailability);


// --- QUẢN LÝ NGƯỜI DÙNG ---

/**
 * @route   GET /api/admins/users
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   DELETE /api/admins/users/:id
 */
router.delete('/users/:id', adminController.deleteUser);


// ✅ SỬA LỖI: Phải export 'router', không phải 'route'
module.exports = router;
