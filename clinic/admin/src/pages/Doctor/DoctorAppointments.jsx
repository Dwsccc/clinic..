import React, { useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets_admin/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, backendUrl } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const now = new Date();

  // Tính số cuộc hẹn đã làm (Đã duyệt và thời gian đã trôi qua)
  const doneAppointmentsCount = appointments.filter(
    (appt) =>
      appt.status === "confirmed" && new Date(appt.start_time) < now
  ).length;

  // Hàm định dạng thời gian
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 bg-[#F8F9FD] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách lịch hẹn</h2>
          <div className="mt-2 flex items-center gap-2 text-gray-600 bg-white w-fit px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <span>📊</span> Số cuộc hẹn đã thực hiện: <strong className="text-primary">{doneAppointmentsCount}</strong>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 italic">Chưa có lịch hẹn nào được đăng ký.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appt) => {
              const isPaid = appt.payment_status?.toLowerCase() === 'paid';
              const isExpired = new Date(appt.start_time) < now;

              return (
                <div
                  key={appt.id}
                  className={`bg-white border rounded-xl p-5 shadow-sm transition-all hover:shadow-md border-gray-100 ${appt.status === 'cancelled' ? 'opacity-75' : ''}`}
                >
                  {/* Thông tin bệnh nhân */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                    <img 
                      className="w-12 h-12 rounded-full object-cover bg-gray-100"
                      src={appt.user?.image ? `${backendUrl}${appt.user.image}` : assets.upload_area} 
                      alt="patient" 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{appt.user?.name || 'Bệnh nhân ẩn danh'}</p>
                      <p className="text-xs text-gray-500">{appt.user?.email}</p>
                    </div>
                    {/* Badge Trạng thái */}
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                      appt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                      appt.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {appt.status === 'pending' ? '⏳ Chờ duyệt' : appt.status === 'confirmed' ? '✅ Đã xác nhận' : '❌ Đã hủy'}
                    </div>
                  </div>

                  {/* Chi tiết lịch hẹn */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">📅 Thời gian:</span>
                      <span className="font-semibold text-gray-700">{formatDateTime(appt.start_time)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">💰 Thanh toán:</span>
                      <span className={`font-bold ${isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                        {isPaid ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                      </span>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 italic">
                      <strong>Ghi chú:</strong> {appt.note || 'Không có ghi chú nào từ bệnh nhân.'}
                    </div>
                  </div>

                  {/* Trạng thái thời gian */}
                  {isExpired && appt.status === 'confirmed' && (
                    <div className="mt-4 pt-4 border-t border-gray-50 text-center">
                      <span className="text-[10px] bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold uppercase">
                        Cuộc hẹn đã diễn ra
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;