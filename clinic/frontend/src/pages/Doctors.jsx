import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext'

const Doctors = () => {
    const { speciality } = useParams()
    // Lấy state từ Context
    const { doctors, setDoctors } = useContext(AppContext)
    
    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate();

    // Danh sách các khoa (Lưu ý: String này phải khớp CHÍNH XÁC với database, bao gồm cả dấu cách)
    const specialities = [
        'Khoa Đa Khoa (Hô hấp/Chung)',
        'Khoa Tiêu Hóa',
        'Khoa Nhi (Trẻ em)',
        'Khoa Thần Kinh',
        'Khoa Da Liễu',
        'Khoa Cơ Xương Khớp',
        'Khoa Tim Mạch'
    ];

    // ✅ 1. Fetch danh sách bác sĩ (Chỉ chạy khi chưa có dữ liệu)
    useEffect(() => {
        // Chỉ fetch khi mảng doctors rỗng
        if (doctors.length === 0) {
            fetch('http://localhost:3000/api/doctors')
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch');
                    return res.json();
                })
                .then(data => {
                    // Kiểm tra xem setDoctors có phải là function không trước khi gọi
                    if (typeof setDoctors === 'function') {
                        setDoctors(data);
                    } else {
                        console.error("Lỗi: setDoctors không được cung cấp từ AppContext!");
                    }
                })
                .catch(err => console.error('Lỗi khi fetch doctors:', err));
        }
    }, [doctors.length, setDoctors]); // Dependency chỉ phụ thuộc vào độ dài mảng

    // ✅ 2. Lọc bác sĩ khi "doctors" hoặc "speciality" thay đổi
    useEffect(() => {
        if (doctors.length > 0) {
            if (speciality) {
                // Decode URL để so sánh đúng chuỗi tiếng Việt (Ví dụ: Khoa%20Nhi -> Khoa Nhi)
                const decodedSpeciality = decodeURIComponent(speciality);
                const filtered = doctors.filter(doc => doc.speciality === decodedSpeciality);
                setFilterDoc(filtered);
            } else {
                setFilterDoc(doctors);
            }
        } else {
            setFilterDoc([]);
        }
    }, [doctors, speciality]);

    return (
        <div>
            <p className='text-gray-600'>Danh sách các bác sĩ chuyên khoa.</p>
            
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                {/* Nút lọc cho Mobile */}
                <button 
                    className={`py-1 px-3 border rounded-none text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} 
                    onClick={() => setShowFilter(prev => !prev)}
                >
                    Bộ lọc
                </button>
                
                {/* Danh sách Filter bên trái */}
                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {specialities.map((s, idx) => (
                        <p key={idx}
                            onClick={() => {
                                // Nếu đang chọn đúng khoa đó thì reset về tất cả, ngược lại thì lọc
                                const currentSpec = decodeURIComponent(speciality || '');
                                if (currentSpec === s) {
                                    navigate('/doctors');
                                } else {
                                    navigate(`/doctors/${encodeURIComponent(s)}`);
                                }
                            }}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer 
                            ${decodeURIComponent(speciality || '') === s ? "bg-indigo-100 text-black font-semibold" : "hover:bg-gray-50"}`}>
                            {s}
                        </p>
                    ))}
                </div>

                {/* Grid hiển thị bác sĩ */}
                <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                    {filterDoc.length > 0 ? (
                        filterDoc.map((item, index) => (
                            <div 
                                onClick={() => {
                                    navigate(`/appointment/${item.id}`);
                                    window.scrollTo(0, 0); // Cuộn lên đầu trang khi click
                                }} 
                                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm hover:shadow-md' 
                                key={item.id || index} // Dùng ID làm key sẽ tốt hơn index
                            >
                                {/* Xử lý ảnh: Nếu không có avatar thì hiển thị ảnh mặc định hoặc placeholder */}
                                <img 
                                    className='bg-blue-50 w-full h-52 object-cover' 
                                    src={item.avatar_url ? `http://localhost:3000${item.avatar_url}` : ''} 
                                    alt={item.name} 
                                    onError={(e) => {
                                        e.target.style.display = 'none'; // Ẩn ảnh nếu lỗi
                                        e.target.nextSibling.style.display = 'flex'; // Hiện div thay thế (nếu bạn code thêm)
                                    }} 
                                />
{/* Thêm logic: Nếu không có ảnh thì hiển thị khung màu xám */}
{!item.avatar_url && (
    <div className='w-full h-52 bg-gray-200 flex items-center justify-center text-gray-500'>
        No Image
    </div>
)}
                                <div className='p-4'>
                                    <div className='flex items-center gap-2 text-sm text-center text-green-500 mb-2'>
                                        <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                                        <p>Sẵn sàng</p>
                                    </div>
                                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                                    {/* Hiển thị thêm kinh nghiệm hoặc phí nếu muốn */}
                                    {item.fees && <p className='text-gray-800 text-sm mt-1 font-bold'>Giá: {parseInt(item.fees).toLocaleString()} VNĐ</p>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className='text-gray-500 text-lg'>Không tìm thấy bác sĩ nào thuộc khoa này.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Doctors