const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// 1. Lấy thông tin cá nhân (Khớp với loadUserProfileData ở frontend)
// GET: /api/user/get-profile
router.get('/get-profile', verifyToken, userController.getUserProfile);

// 2. Cập nhật thông tin cá nhân (Khớp với updateUserProfileData ở frontend)
// POST: /api/user/update-profile
// QUAN TRỌNG: Phải có upload.single('image') vì frontend gửi FormData có chứa file ảnh
router.post('/update-profile', verifyToken, upload.single('image'), userController.updateUserProfile);

// (Tuỳ chọn) API upload ảnh riêng lẻ (Nếu bạn vẫn muốn giữ để dùng cho mục đích khác)
router.post('/upload-avatar', verifyToken, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }
    const imageUrl = `/images/users/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;