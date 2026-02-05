const { Payment, Appointment } = require('../models');

const createPayment = async (req, res) => {
    const { appointment_id, amount, method } = req.body;

    try {
        const appointment = await Appointment.findByPk(appointment_id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
        }

        // RÀNG BUỘC: Chỉ cho thanh toán khi Admin đã "confirmed"
        if (appointment.status !== 'confirmed') {
            return res.status(400).json({ 
                success: false, 
                message: 'Lịch hẹn chưa được xác nhận, không thể thực hiện thanh toán.' 
            });
        }

        // Kiểm tra nếu đã thanh toán rồi để tránh duplicate
        if (appointment.payment_status === 'paid') {
            return res.status(400).json({ success: false, message: 'Lịch hẹn này đã được thanh toán trước đó.' });
        }

        const payment = await Payment.create({
            appointment_id,
            amount,
            method: method || 'cash',
            status: 'success',
            payment_time: new Date(),
        });

        // Cập nhật trạng thái thanh toán trong bảng Appointment
        appointment.payment_status = 'paid';
        await appointment.save();

        res.status(201).json({
            success: true, // Thêm để Frontend dễ check
            message: 'Thanh toán thành công',
            appointment_id: appointment.id,
            payment_status: appointment.payment_status,
            payment,
        });
    } catch (error) {
        console.error("Lỗi Payment Controller:", error);
        res.status(500).json({ success: false, message: 'Lỗi server khi xử lý thanh toán' });
    }
};

module.exports = { createPayment };