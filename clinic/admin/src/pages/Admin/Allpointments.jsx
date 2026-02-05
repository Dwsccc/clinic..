import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets_admin/assets";
import axios from "axios";
import { toast } from "react-toastify";
import Masonry from "react-masonry-css";

// Tách AppointmentCard ra ngoài để tránh lỗi cú pháp "import/export may only appear at the top level"
const AppointmentCard = ({ ap, isPast, backendUrl, aToken, handleStatusChange, handlePayment, formatDateTime }) => {
  const isPaid = ap.payment_status?.toLowerCase() === 'paid';
  const isActionable = !isPast && ap.status === "pending";

  return (
    <div className={`bg-white border rounded-xl p-5 mb-6 shadow-sm transition-all duration-300 ${ap.status === 'cancelled' ? 'opacity-75' : 'hover:shadow-md'}`}>
      
      {/* Thông tin bệnh nhân & Trạng thái thanh toán */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
        <img 
          src={ap.user?.image ? `${backendUrl}${ap.user.image}` : assets.upload_area} 
          className="w-12 h-12 rounded-full object-cover bg-gray-50" 
          alt="user" 
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{ap.user?.name || "Khách"}</h3>
          <p className={`text-[10px] inline-block px-2 py-0.5 rounded-full font-bold uppercase mt-1 ${
            isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {isPaid ? '● Đã thanh toán' : '○ Chưa thanh toán'}
          </p>
        </div>
        
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
          ap.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
          ap.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
          'bg-blue-50 text-blue-600 border-blue-100'
        }`}>
          {ap.status === 'pending' ? 'Chờ xác nhận' : ap.status === 'confirmed' ? 'Đã chấp nhận' : 'Đã hủy'}
        </div>
      </div>

      {/* Chi tiết lịch hẹn */}
      <div className="py-4 space-y-2">
        <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
          <span className="text-primary">🩺</span> BS. {ap.doctor?.name}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span>📅</span> {formatDateTime(ap.start_time)}
        </p>
        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <span>💰</span> Phí: {Number(ap.doctor?.fees).toLocaleString('vi-VN')} VND
        </p>
      </div>

      {/* Thao tác */}
      <div className="pt-4 border-t border-gray-50 flex flex-col gap-2">
        {isActionable ? (
          <div className="flex gap-2">
            <button 
              onClick={() => handleStatusChange(ap.id, 'confirmed')}
              className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-medium hover:bg-opacity-90"
            >
              Chấp nhận
            </button>
            <button 
              onClick={() => handleStatusChange(ap.id, 'cancelled')}
              className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-medium hover:bg-red-100"
            >
              Từ chối
            </button>
          </div>
        ) : (
          <div className="flex-1 text-center py-2 bg-gray-50 rounded-lg">
             <p className="text-xs text-gray-400 italic">
               {isPast && !isPaid && ap.status !== 'cancelled' ? 
                "❌ Tự động hủy (Quá hạn thanh toán)" : 
                isPast ? "Cuộc hẹn đã kết thúc" : 
                ap.status === 'confirmed' ? "Lịch hẹn đã chốt" : "Lịch hẹn đã đóng"}
             </p>
          </div>
        )}

        {/* Nút xác nhận thanh toán thủ công cho Admin */}
        {ap.status === 'confirmed' && !isPaid && !isPast && (
            <button 
                onClick={() => handlePayment(ap.id)}
                className="w-full bg-yellow-400 text-white py-2 rounded-lg text-xs font-bold hover:bg-yellow-500 transition-all"
            >
                💳 Xác nhận thanh toán (Tiền mặt)
            </button>
        )}
      </div>
    </div>
  );
};

const AppointmentPage = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/appointments/all`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (data.success) {
        setAppointments(data.appointments.sort((a, b) => new Date(b.start_time) - new Date(a.start_time)));
      }
    } catch (error) {
      toast.error("Lỗi server: " + error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/appointments/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      if (data.success) {
        toast.success(`Đã ${newStatus === 'confirmed' ? 'chấp nhận' : 'từ chối'} cuộc hẹn`);
        fetchAppointments();
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handlePayment = async (id) => {
    try {
        const { data } = await axios.put(
            `${backendUrl}/api/appointments/${id}/payment`,
            { payment_status: 'Paid' },
            { headers: { Authorization: `Bearer ${aToken}` } }
        );
        if (data.success) {
            toast.success("Xác nhận thanh toán thành công");
            fetchAppointments();
        }
    } catch (err) {
        toast.error("Lỗi server khi cập nhật thanh toán");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit", minute: "2-digit",
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };

  const now = new Date();
  const currentAppointments = appointments.filter((ap) => new Date(ap.start_time) >= now);
  const pastAppointments = appointments.filter((ap) => new Date(ap.start_time) < now);
  const breakpointColumnsObj = { default: 3, 1100: 2, 700: 1 };

  return (
    <div className="p-6 bg-[#F8F9FD] min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Quản Lý Lịch Hẹn</h1>

        <section className="mb-12">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
             <span className="w-2 h-2 bg-primary rounded-full"></span> Cuộc hẹn sắp tới
          </h2>
          {currentAppointments.length === 0 ? (
            <p className="text-gray-400 text-sm italic">Không có cuộc hẹn nào.</p>
          ) : (
            <Masonry breakpointCols={breakpointColumnsObj} className="flex -ml-6 w-auto" columnClassName="pl-6">
              {currentAppointments.map(ap => (
                <AppointmentCard 
                    key={ap.id} 
                    ap={ap} 
                    isPast={false} 
                    backendUrl={backendUrl}
                    aToken={aToken}
                    handleStatusChange={handleStatusChange}
                    handlePayment={handlePayment}
                    formatDateTime={formatDateTime}
                />
              ))}
            </Masonry>
          )}
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
             <span className="w-2 h-2 bg-gray-300 rounded-full"></span> Lịch sử cuộc hẹn
          </h2>
          <Masonry breakpointCols={breakpointColumnsObj} className="flex -ml-6 w-auto" columnClassName="pl-6">
            {pastAppointments.map(ap => (
                <AppointmentCard 
                    key={ap.id} 
                    ap={ap} 
                    isPast={true} 
                    backendUrl={backendUrl}
                    aToken={aToken}
                    handleStatusChange={handleStatusChange}
                    handlePayment={handlePayment}
                    formatDateTime={formatDateTime}
                />
            ))}
          </Masonry>
        </section>
      </div>
    </div>
  );
};

export default AppointmentPage;