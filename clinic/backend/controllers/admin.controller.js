const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;
const Doctor = db.Doctor;
const Appointment = db.Appointment;

// 1. API Đăng nhập Admin (Thêm vào nếu chưa có trong authController)
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Logic đăng nhập cứng cho Admin (như đã bàn trước đó)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = require('jsonwebtoken').sign(email + Date.now(), process.env.JWT_SECRET);
            return res.json({ success: true, token, message: "Login thành công" });
        } else {
            return res.json({ success: false, message: "Sai Email hoặc Mật khẩu" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 2. Tạo bác sĩ mới
exports.createDoctor = async (req, res) => {
    try {
        const { name, email, password, experience, fees, speciality, degree, address, about } = req.body;
        const avatar_url = req.file ? `/images/doctors/${req.file.filename}` : '';

        // Kiểm tra email
        const existing = await Doctor.findOne({ where: { email } });
        if (existing) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });

        const password_hash = await bcrypt.hash(password, 10);

        const newDoctor = await Doctor.create({
            name, email, password_hash, experience, fees, speciality, degree, address, about, avatar_url,
            is_active: true // Mặc định là active
        });

        res.status(201).json({ success: true, message: 'Tạo bác sĩ thành công', doctor: newDoctor });
    } catch (err) {
        console.error('Error create doctor:', err);
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
};

// 3. Lấy danh sách tất cả bác sĩ (Khớp với Frontend gọi /all-doctors)
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({ order: [['id', 'DESC']] });
        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Đổi trạng thái bác sĩ (Active/Inactive)
// Frontend gọi: /api/admins/change-availability
// File: controllers/admin.controller.js

exports.changeAvailability = async (req, res) => {
    try {
        // ❌ SAI: const { docId } = req.body;
        // ✅ ĐÚNG: Lấy 'id' từ req.params vì route là /doctors/:id/toggle
        const { id } = req.params; 

        const doctor = await db.Doctor.findByPk(id);

        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy bác sĩ' 
            });
        }

        // Đảo ngược trạng thái hoạt động
        doctor.is_active = !doctor.is_active;
        await doctor.save();

        res.json({
            success: true,
            message: `Bác sĩ đã được ${doctor.is_active ? 'kích hoạt' : 'vô hiệu hoá'} thành công`,
            is_active: doctor.is_active
        });
    } catch (err) {
        console.error('Lỗi Toggle Doctor:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi đổi trạng thái bác sĩ',
            error: err.message
        });
    }
};
// 5. Dashboard Stats (Logic tính doanh thu của bạn rất tốt)
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalDoctors = await Doctor.count();

        const appointments = await Appointment.findAll({
            attributes: ['id', 'doctor_id', 'status', 'payment_status'],
            raw: true,
        });

        const totalAppointments = appointments.length;
        const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
        const canceledAppointments = appointments.filter(a => a.status === 'cancelled').length;
        const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

        // Lấy fees để tính tiền
        const doctors = await Doctor.findAll({ attributes: ['id', 'fees'], raw: true });
        const doctorFeesMap = {};
        doctors.forEach(doc => {
            // Xử lý chuỗi tiền tệ
            let fee = 0;
            if (typeof doc.fees === 'string') fee = parseFloat(doc.fees.replace(/[^\d.]/g, '')) || 0;
            else if (typeof doc.fees === 'number') fee = doc.fees;
            doctorFeesMap[doc.id] = fee;
        });

        let totalRevenue = 0;
        for (const appt of appointments) {
            if ((appt.payment_status || '').toLowerCase() === 'paid') {
                totalRevenue += (doctorFeesMap[appt.doctor_id] || 0);
            }
        }

        return res.json({
            success: true,
            data: {
                totalUsers, totalDoctors, totalAppointments,
                confirmedAppointments, canceledAppointments, pendingAppointments,
                totalRevenue
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 6. Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        // Lấy list user, loại bỏ trường password_hash để bảo mật
        const users = await User.findAll({ 
            attributes: { exclude: ['password_hash'] },
            order: [['created_at', 'DESC']]
        });
        
        res.json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        // (Tùy chọn) Kiểm tra xem user có lịch hẹn chưa hoàn thành không trước khi xóa
        // const pending = await Appointment.findOne({ where: { user_id: id, status: 'pending' } });
        // if (pending) return res.status(400).json({ success: false, message: 'User còn lịch hẹn chưa xong' });

        await user.destroy();
        res.json({ success: true, message: 'Đã xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ... (Giữ nguyên các hàm loginAdmin, createDoctor, getAllDoctors, changeAvailability, getAllUsers, deleteUser cũ)

// --- THÊM 2 HÀM NÀY VÀO CUỐI FILE ---

// 8. Cập nhật thông tin bác sĩ
exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, experience, fees, speciality, degree, address, about } = req.body;

        const doctor = await Doctor.findByPk(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });
        }

        // Cập nhật thông tin
        doctor.name = name || doctor.name;
        doctor.experience = experience || doctor.experience;
        doctor.fees = fees || doctor.fees;
        doctor.speciality = speciality || doctor.speciality;
        doctor.degree = degree || doctor.degree;
        doctor.address = address || doctor.address;
        doctor.about = about || doctor.about;

        // Nếu có upload ảnh mới thì cập nhật
        if (req.file) {
            doctor.avatar_url = `/images/doctors/${req.file.filename}`;
        }

        await doctor.save();

        res.json({ success: true, message: 'Cập nhật bác sĩ thành công', doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 9. Xóa bác sĩ
exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findByPk(id);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });
        }

        await doctor.destroy();
        res.json({ success: true, message: 'Đã xóa bác sĩ thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};