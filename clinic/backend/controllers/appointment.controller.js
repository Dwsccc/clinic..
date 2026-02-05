const db = require('../models');
const Appointment = db.Appointment;
const Doctor = db.Doctor;
const User = db.User;
// 1. Đặt lịch hẹn mới
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor_id, start_time, note } = req.body;

    // Kiểm tra token xác thực
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để đặt lịch' });
    }

    if (!doctor_id || !start_time) {
      return res.status(400).json({ success: false, message: 'doctor_id và start_time là bắt buộc' });
    }

    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Bác sĩ không tồn tại' });
    }

    // Kiểm tra trùng lịch đã xác nhận
    const existingConfirmed = await Appointment.findOne({
      where: { doctor_id, start_time, status: 'confirmed' }
    });

    if (existingConfirmed) {
      return res.status(400).json({ success: false, message: 'Khung giờ này đã có người đặt lịch.' });
    }

    const appointment = await Appointment.create({
      user_id: req.user.id,
      doctor_id,
      start_time,
      note,
      status: 'pending',
      payment_status: 'unpaid' // Mặc định chưa thanh toán
    });

    res.status(201).json({ success: true, message: 'Đặt lịch thành công', appointment });
  } catch (err) {
    console.error('Lỗi bookAppointment:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi đặt lịch', error: err.message });
  }
};

// 2. Lấy lịch hẹn của người dùng hiện tại
exports.getUserAppointments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'Không tìm thấy thông tin xác thực' });
    }

    const appointments = await Appointment.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'speciality', 'avatar_url', 'address', 'fees'],
        },
      ],
      order: [['start_time', 'DESC']],
    });

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch hẹn', error: err.message });
  }
};

// 3. Cập nhật trạng thái (Admin/Doctor)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    }

    // Ràng buộc: Đã thanh toán thì không được hủy (cancelled)
    // Lưu ý: Kiểm tra cả 'paid' (chữ thường) và 'Paid' để tránh lỗi data cũ
    const isPaid = appointment.payment_status && appointment.payment_status.toLowerCase() === 'paid';
    if (isPaid && status === 'cancelled') {
        return res.status(400).json({ success: false, message: 'Lịch hẹn đã thanh toán không thể hủy.' });
    }

    // Ràng buộc: Không khôi phục lịch đã hủy
    if (appointment.status === 'cancelled' && status === 'pending') {
        return res.status(400).json({ success: false, message: 'Lịch hẹn đã hủy không thể khôi phục.' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ success: true, message: 'Cập nhật trạng thái thành công', appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trạng thái', error: err.message });
  }
};

// 4. Lấy danh sách thời gian đã bị đặt (Dùng cho lịch hiển thị ở Frontend)
exports.getConfirmedTimes = async (req, res) => {
  try {
    const confirmedAppointments = await Appointment.findAll({
      where: { status: "confirmed" },
      attributes: ["start_time"],
      order: [["start_time", "ASC"]],
    });

    res.json({
      success: true,
      confirmedTimes: confirmedAppointments.map(ap => ({
        start_time: ap.start_time,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi lấy thời gian", error: error.message });
  }
};

// 5. Xóa lịch hẹn
exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    }

    // Chặn xóa nếu đã xác nhận hoặc đã thanh toán
    const isPaid = appointment.payment_status && appointment.payment_status.toLowerCase() === 'paid';
    if (appointment.status === 'confirmed' || isPaid) {
      return res.status(400).json({ success: false, message: 'Lịch hẹn đã xác nhận hoặc thanh toán không thể xóa' });
    }

    await appointment.destroy();
    return res.json({ success: true, message: 'Xoá lịch hẹn thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server khi xóa', error: error.message });
  }
};

// Giữ nguyên các hàm getAllAppointments và getDoctorAppointments của bạn...
// controllers/appointment.controller.js

const { Op } = require('sequelize'); // Đảm bảo đã import Op

exports.getAllAppointments = async (req, res) => {
  try {
    const now = new Date();

    // 1. TỰ ĐỘNG CẬP NHẬT: Hủy các lịch hẹn quá hạn mà chưa thanh toán
    await Appointment.update(
      { status: 'cancelled' },
      { 
        where: {
          start_time: { [Op.lt]: now }, // Thời gian đã trôi qua
          // Kiểm tra nếu trạng thái không phải là 'paid' (không phân biệt hoa thường)
          payment_status: { 
            [Op.notIn]: ['paid', 'Paid', 'PAID'] 
          },
          // Chỉ hủy những lịch chưa bị hủy hoặc chưa hoàn thành
          status: { 
            [Op.notIn]: ['cancelled', 'completed'] 
          }
        }
      }
    );

    // 2. Lấy danh sách lịch hẹn sau khi đã cập nhật
    const appointments = await Appointment.findAll({
      order: [['start_time', 'DESC']],
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'name', 'email', 'image'] 
        },
        { 
          model: Doctor, 
          as: 'doctor', 
          attributes: ['id', 'name', 'speciality', 'fees'] 
        }
      ]
    });
    
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Lỗi getAllAppointments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { doctor_id: req.user.id },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['start_time', 'DESC']],
    });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
  }
};

// Thêm hàm này vào file controllers/appointment.controller.js

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    }

    // Chỉ cho phép cập nhật thanh toán cho các lịch đã được xác nhận (confirmed)
    if (appointment.status !== 'confirmed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Lịch hẹn cần được duyệt trước khi xác nhận thanh toán.' 
      });
    }

    appointment.payment_status = payment_status; // Ví dụ: 'Paid'
    await appointment.save();

    res.json({ 
      success: true, 
      message: 'Cập nhật trạng thái thanh toán thành công', 
      appointment 
    });
  } catch (error) {
    console.error('Lỗi updatePaymentStatus:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật thanh toán' });
  }
};