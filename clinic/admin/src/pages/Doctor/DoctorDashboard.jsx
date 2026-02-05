import React, { useEffect, useContext, useMemo } from 'react'
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from 'react-toastify'

const DoctorDashboard = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    dashboardStats,
    getDashboardStats,
  } = useContext(DoctorContext)

  // Tự động tải dữ liệu khi có Token
  useEffect(() => {
    if (dToken) {
      getAppointments()
      getDashboardStats()
    } else {
      toast.error('Phiên làm việc hết hạn, vui lòng đăng nhập lại!')
    }
  }, [dToken])

  // Sử dụng useMemo để tính toán số lượng lịch hẹn giúp tối ưu hiệu suất (thay vì dùng useState + useEffect lặp lại)
  const stats = useMemo(() => {
    return {
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length
    }
  }, [appointments])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển Bác sĩ</h1>
        <p className="text-gray-500 mt-1">Tổng quan về hoạt động và lịch hẹn của bạn.</p>
      </div>

      {/* Grid thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Doanh thu - Lấy từ dashboardStats backend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl text-2xl">💰</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng doanh thu</p>
            <p className="text-xl font-bold text-gray-800">
              {dashboardStats.totalRevenue ? dashboardStats.totalRevenue.toLocaleString('vi-VN') : 0} <span className="text-sm font-normal">VND</span>
            </p>
          </div>
        </div>

        {/* Số ca đã khám xong */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-2xl">🩺</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Ca đã hoàn thành</p>
            <p className="text-xl font-bold text-gray-800">{dashboardStats.completedAppointments || 0}</p>
          </div>
        </div>

        {/* Lịch đang chờ duyệt */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-xl text-2xl">⏳</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Đang chờ duyệt</p>
            <p className="text-xl font-bold text-gray-800">{stats.pending}</p>
          </div>
        </div>

        {/* Lịch đã xác nhận */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-2xl">✅</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Sắp tới (Đã chốt)</p>
            <p className="text-xl font-bold text-gray-800">{stats.confirmed}</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Danh sách lịch hẹn mới nhất (Ví dụ) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full"></span>
            Lịch hẹn gần đây
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 font-medium border-b border-gray-50">
                <tr>
                  <th className="py-3 px-2">Bệnh nhân</th>
                  <th className="py-3 px-2">Ngày giờ</th>
                  <th className="py-3 px-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.slice(0, 5).map((appt, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-gray-700">{appt.user?.name || 'Ẩn danh'}</td>
                    <td className="py-3 px-2 text-gray-500">{new Date(appt.start_time).toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        appt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột phải: Biểu đồ tròn hoặc tóm tắt trạng thái */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">Tỷ lệ trạng thái</h2>
          <div className="space-y-4">
            <StatusProgressBar label="Đã xác nhận" count={stats.confirmed} total={appointments.length} color="bg-emerald-500" />
            <StatusProgressBar label="Đang chờ duyệt" count={stats.pending} total={appointments.length} color="bg-orange-400" />
            <StatusProgressBar label="Đã hủy" count={stats.cancelled} total={appointments.length} color="bg-red-500" />
          </div>
          <p className="mt-8 text-xs text-gray-400 text-center uppercase tracking-widest font-bold">
            Tổng số lịch: {appointments.length}
          </p>
        </div>
      </div>
    </div>
  )
}

// Component con hiển thị thanh trạng thái
const StatusProgressBar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="font-bold">{count}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

export default DoctorDashboard