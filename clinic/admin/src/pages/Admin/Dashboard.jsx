import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl, aToken } = useContext(AdminContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = aToken || localStorage.getItem("aToken");

        if (!token) {
           setError("Chưa đăng nhập (Thiếu Token)");
           setLoading(false);
           return;
        }

        const res = await axios.get(`${backendUrl}/api/admins/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          // stats từ API bao gồm: totalUsers, totalDoctors, totalAppointments, confirmedAppointments, canceledAppointments, pendingAppointments, totalRevenue
          setStats(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        console.error('Dashboard Error:', err);
        setError(err.response?.data?.message || "Không thể kết nối đến server");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [backendUrl, aToken]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-500">⏳ Đang tải dữ liệu thống kê...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 font-medium">⚠️ {error}</div>;
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển Admin</h2>
        <p className="text-gray-500 text-sm">Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.</p>
      </div>

      {/* Grid Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng Doanh thu" value={`${Number(stats.totalRevenue).toLocaleString()}đ`} icon="💰" color="bg-orange-50" />
        <StatCard title="Tổng Bác sĩ" value={stats.totalDoctors} icon="🩺" color="bg-blue-50" />
        <StatCard title="Tổng Bệnh nhân" value={stats.totalUsers} icon="👥" color="bg-green-50" />
        <StatCard title="Tổng Lịch hẹn" value={stats.totalAppointments} icon="📅" color="bg-purple-50" />
      </div>

      {/* Chi tiết trạng thái lịch hẹn */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <StatusBox title="Chờ xác nhận" value={stats.pendingAppointments} color="text-blue-600" bgColor="bg-blue-50" />
        <StatusBox title="Đã xác nhận" value={stats.confirmedAppointments} color="text-green-600" bgColor="bg-green-50" />
        <StatusBox title="Đã hủy" value={stats.canceledAppointments} color="text-red-600" bgColor="bg-red-50" />
      </div>

      {/* Section: Cuộc hẹn mới nhất */}
      <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">🔔 Cuộc hẹn gần đây</h3>
          <button className="text-primary text-sm font-medium hover:underline">Xem tất cả</button>
        </div>
        
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-6 py-3">Bác sĩ</th>
                <th className="px-6 py-3">Bệnh nhân</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* Lưu ý: Nếu backend chưa trả về danh sách appts cụ thể trong data, phần này sẽ hiển thị rỗng */}
              {stats.latestAppointments && stats.latestAppointments.length > 0 ? (
                stats.latestAppointments.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">BS. {item.doctor?.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.user?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        item.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(item.start_time).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">Chưa có dữ liệu lịch hẹn mới.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component con: Thẻ thống kê chính
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 border border-gray-100 hover:scale-[1.02] transition-transform">
    <div className={`text-3xl ${color} w-14 h-14 flex items-center justify-center rounded-2xl shadow-inner`}>{icon}</div>
    <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-gray-800 mt-0.5">{value}</p>
    </div>
  </div>
);

// Component con: Ô trạng thái nhỏ
const StatusBox = ({ title, value, color, bgColor }) => (
  <div className={`${bgColor} ${color} p-4 rounded-xl flex justify-between items-center border border-current border-opacity-10`}>
    <span className="font-bold text-sm">{title}</span>
    <span className="text-xl font-black">{value}</span>
  </div>
);

export default Dashboard;