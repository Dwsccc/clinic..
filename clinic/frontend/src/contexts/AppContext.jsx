import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    // 1. Khai báo URL Backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const currencySymbol = '₫';

    const [doctors, setDoctors] = useState([]);
    
    // 2. State Token
    const [token, setToken] = useState(localStorage.getItem('token') || false);

    // 3. State UserData
    const [userData, setUserData] = useState(() => {
        try {
            const stored = localStorage.getItem('userData');
            return (stored && stored !== "undefined") ? JSON.parse(stored) : false;
        } catch (error) {
            return false;
        }
    });

    // Hàm lấy danh sách bác sĩ
    const getDoctorsData = async () => {
        try {
            // LƯU Ý: Kiểm tra lại route bên backend. 
            // Nếu backend là router.get('/', ...), thì url là '/api/doctors'
            // Nếu backend là router.get('/list', ...), thì url là '/api/doctors/list'
            // Ở đây mình để '/api/doctors' theo chuẩn phổ biến nhất.
            const { data } = await axios.get(backendUrl + '/api/doctors'); 
            
            if (data.success) {
                setDoctors(data.doctors || data); // Xử lý phòng hờ cấu trúc trả về khác nhau
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            // toast.error(error.message);
        }
    }

    // Hàm lấy thông tin User Profile
    const loadUserProfileData = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { // Lưu ý: 'api/users' hay 'api/user' phải khớp backend
                headers: { Authorization: `Bearer ${token}` } // Đôi khi backend cần thêm 'Bearer '
            });
            // Một số backend dùng headers: { token } thay vì Authorization, bạn check lại nhé

            if (data.success) {
                setUserData(data.userData);
                localStorage.setItem('userData', JSON.stringify(data.userData));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Lỗi tải thông tin người dùng");
        }
    }

    // useEffect 1: Tự động lấy bác sĩ khi web load
    useEffect(() => {
        getDoctorsData();
    }, []);

    // useEffect 2: Khi token thay đổi
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            loadUserProfileData();
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setUserData(false);
        }
    }, [token]);

    // 4. Đóng gói value (QUAN TRỌNG: Đã thêm setDoctors)
    const value = {
        doctors, setDoctors, // <--- THÊM setDoctors VÀO ĐÂY ĐỂ SỬA LỖI
        getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;