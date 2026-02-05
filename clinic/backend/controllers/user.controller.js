const db = require('../models');
const User = db.User;

// 1. Lấy thông tin cá nhân (Khớp với route /get-profile)
exports.getUserProfile = async (req, res) => {
  try {
    // Lấy ID từ req.user (do middleware auth giải mã token)
    const userId = req.user.id; 

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }, // Không trả về mật khẩu
    });

    if (!user) {
      return res.json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({
      success: true,
      userData: user // Trả về object user khớp với frontend
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};
// user.controller.js
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, address, gender, dob } = req.body;
        const imageFile = req.file;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        // Cập nhật thông tin
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (gender) user.gender = gender;
        
        // Xử lý ngày sinh: Nếu gửi chuỗi rỗng thì để NULL để tránh lỗi 500
        if (dob === "" || dob === null) {
            user.dob = null;
        } else if (dob) {
            user.dob = dob;
        }

        if (imageFile) {
            user.image = `/images/users/${imageFile.filename}`;
        }

        await user.save();

        // Trả về dữ liệu đã cập nhật
        res.json({ 
            success: true, 
            message: 'Cập nhật thông tin thành công', 
            userData: user 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
// 3. Lấy tất cả user (Dành cho admin - giữ nguyên logic nhưng sửa tên cột)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']], // Chú ý: dùng created_at khớp với DB
    });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};