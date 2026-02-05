import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  // 1. Khởi tạo state
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [doctors, setDoctors] = useState([]);
  
  // 2. Cấu hình URL Backend
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  // 3. Hàm lấy danh sách bác sĩ
  const getAllDoctors = async () => {
    try {
      // Kiểm tra xem có token chưa mới gọi API
      if (!aToken) return;

      // ✅ FIX 1: URL chuẩn là '/api/admins/doctors' (khớp với route backend)
      // ✅ FIX 2: Header chuẩn Bearer Token để tránh lỗi 403
      const { data } = await axios.get(backendUrl + '/api/admins/doctors', {
        headers: { Authorization: `Bearer ${aToken}` } 
      });

      if (data.success) {
        setDoctors(data.doctors);
        // console.log("Lấy danh sách bác sĩ thành công:", data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 4. Hàm thay đổi trạng thái hoạt động (Active/Inactive)
  const changeAvailability = async (docId) => {
    try {
      // ✅ FIX 3: Gọi đúng API Toggle (PATCH)
      const { data } = await axios.patch(backendUrl + `/api/admins/doctors/${docId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${aToken}` }
      });
      
      if (data.success) {
        toast.success(data.message);
        getAllDoctors(); // Load lại danh sách ngay lập tức để UI cập nhật
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  // 5. Hàm Logout
  const logout = () => {
    setAToken(''); 
    localStorage.removeItem('aToken');
    setDoctors([]);
    toast.success("Đã đăng xuất");
  };

  // 6. Tự động Sync Token và Load dữ liệu
  useEffect(() => {
    if (aToken) {
      localStorage.setItem('aToken', aToken);
      getAllDoctors(); // Tự động lấy danh sách khi có token
    } else {
      localStorage.removeItem('aToken');
      setDoctors([]);
    }
  }, [aToken]);

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;