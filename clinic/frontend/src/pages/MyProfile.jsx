import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext'; 
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const { token, backendUrl, userData, loadUserProfileData } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false); 
    const [loading, setLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        address: '',
        gender: 'Khác',
        dob: '',
        email: '',
        image: ''
    });

    // Cập nhật profileData khi dữ liệu từ Context (Database) thay đổi
    useEffect(() => {
        if (userData) {
            setProfileData({
                name: userData.name || '',
                phone: userData.phone || '',
                address: userData.address || '',
                gender: userData.gender || 'Khác',
                dob: userData.dob ? userData.dob.split('T')[0] : '', 
                email: userData.email || '',
                image: userData.image || ''
            });
        }
    }, [userData]);

    const updateUserProfileData = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', profileData.name);
            formData.append('phone', profileData.phone);
            formData.append('address', profileData.address);
            formData.append('gender', profileData.gender);
            formData.append('dob', profileData.dob);

            if (image) {
                formData.append('image', image);
            }

            // Gửi yêu cầu với Token trong Header để tránh lỗi 401
            const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("Cập nhật thông tin thành công!");
                await loadUserProfileData(); // Tải lại dữ liệu mới nhất
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Lỗi cập nhật thông tin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-lg mx-auto flex flex-col gap-2 text-sm pt-5 mb-10'>
            
            {/* --- Ảnh Đại Diện --- */}
            <div className='flex flex-col items-center mb-6'>
                {isEdit ? (
                    <label htmlFor="image" className='cursor-pointer relative'>
                        <div className='w-36 h-36 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg'>
                            <img 
                                className='w-full h-full object-cover' 
                                src={image ? URL.createObjectURL(image) : (profileData.image ? `${backendUrl}${profileData.image}` : 'https://i.imgur.com/vU2j5yJ.png')} 
                                alt="avatar" 
                            />
                        </div>
                        <div className='absolute inset-0 bg-black/30 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity'>
                             <p className='text-white text-xs font-medium'>Thay đổi ảnh</p>
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </label>
                ) : (
                    <div className='w-36 h-36 rounded-full overflow-hidden border-4 border-gray-100 shadow-md'>
                        <img 
                            className='w-full h-full object-cover' 
                            src={profileData.image ? `${backendUrl}${profileData.image}` : 'https://i.imgur.com/vU2j5yJ.png'} 
                            alt="avatar" 
                        />
                    </div>
                )}
            </div>

            {/* --- Tên Hiển Thị --- */}
            <div className='text-center'>
                {isEdit ? (
                    <input 
                        className='bg-gray-50 text-3xl font-bold max-w-full text-center border-b-2 border-primary focus:outline-none' 
                        type="text" 
                        value={profileData.name} 
                        onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))} 
                    />
                ) : (
                    <p className='font-bold text-3xl text-neutral-800'>{profileData.name}</p>
                )}
            </div>

            <hr className='bg-zinc-400 h-[1px] border-none my-6' />

            {/* --- Thông Tin Chi Tiết --- */}
            <div className='grid grid-cols-[1fr_2fr] gap-y-5 text-neutral-700 px-4'>
                <p className='font-bold underline text-primary col-span-2 uppercase text-xs'>Thông tin liên hệ</p>
                
                <p className='font-semibold'>Email:</p>
                <p className='text-blue-500 font-medium'>{profileData.email}</p>

                <p className='font-semibold'>Điện thoại:</p>
                {isEdit ? (
                    <input 
                        className='bg-gray-100 rounded px-2 py-1 outline-primary' 
                        type="text" 
                        value={profileData.phone} 
                        onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))} 
                    />
                ) : (
                    <p className='text-zinc-500'>{profileData.phone || "Chưa cập nhật"}</p>
                )}

                <p className='font-semibold'>Địa chỉ:</p>
                {isEdit ? (
                    <input 
                        className='bg-gray-100 rounded px-2 py-1 outline-primary' 
                        type="text" 
                        value={profileData.address} 
                        onChange={e => setProfileData(prev => ({ ...prev, address: e.target.value }))} 
                    />
                ) : (
                    <p className='text-zinc-500'>{profileData.address || "Chưa cập nhật"}</p>
                )}

                <p className='font-bold underline text-primary col-span-2 uppercase text-xs mt-3'>Thông tin cơ bản</p>

                <p className='font-semibold'>Giới tính:</p>
                {isEdit ? (
                    <select 
                        className='bg-gray-100 rounded px-2 py-1 max-w-fit outline-primary' 
                        onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))} 
                        value={profileData.gender}
                    >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                ) : (
                    <p className='text-zinc-500'>{profileData.gender}</p>
                )}

                <p className='font-semibold'>Ngày sinh:</p>
                {isEdit ? (
                    <input 
                        className='bg-gray-100 rounded px-2 py-1 max-w-fit outline-primary' 
                        type="date" 
                        onChange={(e) => setProfileData(prev => ({ ...prev, dob: e.target.value }))} 
                        value={profileData.dob} 
                    />
                ) : (
                    <p className='text-zinc-500'>
                        {profileData.dob ? new Date(profileData.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                    </p>
                )}
            </div>

            {/* --- Nút Thao Tác --- */}
            <div className='mt-10 flex gap-4 justify-center'>
                {isEdit ? (
                    <>
                        <button 
                            className='bg-primary text-white px-10 py-2 rounded-full hover:shadow-lg transition-all disabled:bg-zinc-400'
                            onClick={updateUserProfileData}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <button 
                            className='border border-gray-300 px-10 py-2 rounded-full hover:bg-gray-100 transition-all'
                            onClick={() => { setIsEdit(false); setImage(false); }}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                    </>
                ) : (
                    <button 
                        className='bg-primary text-white px-10 py-2 rounded-full hover:shadow-lg transition-all'
                        onClick={() => setIsEdit(true)}
                    >
                        Chỉnh sửa hồ sơ
                    </button>
                )}
            </div>
        </div>
    );
}

export default MyProfile;