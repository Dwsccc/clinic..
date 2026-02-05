import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
    const [doctor, setDoctor] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        degree: "",
        experience: "1 Năm",
        speciality: "Khoa Đa Khoa (Hô hấp/Chung)",
        address: "",
        fees: "",
        about: "",
    });
    const [image, setImage] = useState(null);
    const token = localStorage.getItem("dToken");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchDoctorProfile = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctors/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setDoctor(data.doctor);
                setFormData({
                    name: data.doctor.name || "",
                    email: data.doctor.email || "",
                    degree: data.doctor.degree || "",
                    experience: data.doctor.experience || "1 Năm",
                    speciality: data.doctor.speciality || "Khoa Đa Khoa (Hô hấp/Chung)",
                    address: data.doctor.address || "",
                    fees: data.doctor.fees || "",
                    about: data.doctor.about || "",
                });
            } else {
                toast.error("Không thể tải dữ liệu hồ sơ.");
            }
        } catch (err) {
            toast.error("Lỗi khi tải hồ sơ bác sĩ.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchDoctorProfile();
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = new FormData();
            if (image) updateData.append("image", image);
            Object.keys(formData).forEach((key) => updateData.append(key, formData[key]));

            const { data } = await axios.put(`${backendUrl}/api/doctors/me`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (data.success) {
                toast.success("Cập nhật hồ sơ thành công!");
                fetchDoctorProfile();
                setImage(null);
            } else {
                toast.error(data.message || "Cập nhật thất bại.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi cập nhật hồ sơ.");
        }
    };

    if (!doctor) return <p className="text-center mt-10 text-gray-500">Đang tải hồ sơ...</p>;

    const avatarSrc = image
        ? URL.createObjectURL(image)
        : doctor.avatar_url
            ? doctor.avatar_url.startsWith("http")
                ? doctor.avatar_url
                : `${backendUrl}${doctor.avatar_url}`
            : "https://via.placeholder.com/80";

    return (
        <div className="flex place-items-start justify-center bg-gray-100 p-5 min-h-screen">
            <div className="w-full max-w-6xl bg-white shadow-md rounded-xl p-8 flex flex-col" style={{ minHeight: "80vh" }}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Hồ Sơ Bác Sĩ</h2>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Phần Ảnh Đại Diện */}
                    <div className="flex items-center gap-6">
                        <label htmlFor="avatar" className="cursor-pointer relative group">
                            <img
                                src={avatarSrc}
                                alt="Avatar"
                                className="w-24 h-24 object-cover rounded-full border-2 border-primary group-hover:opacity-80 transition-all"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <span className="text-white text-[10px] font-bold bg-black/50 px-2 py-1 rounded">Đổi ảnh</span>
                            </div>
                            <input
                                type="file"
                                id="avatar"
                                hidden
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label>
                        <div>
                            <p className="font-medium text-gray-700">{formData.name}</p>
                            <p className="text-sm text-gray-500">Nhấn vào ảnh để thay đổi ảnh đại diện</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-600">Họ và Tên</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 focus:border-primary outline-none"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-600">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 bg-gray-50"
                                readOnly
                            />
                        </div>

                        {/* Học vị */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-600">Học vị (Bằng cấp)</label>
                            <input
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 focus:border-primary outline-none"
                            />
                        </div>

                        {/* Kinh nghiệm */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-600">Kinh nghiệm</label>
                            <select 
                                name="experience" 
                                value={formData.experience} 
                                onChange={handleChange} 
                                className="w-full border rounded px-3 py-2 focus:border-primary outline-none"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i} value={`${i + 1} Năm`}>{i + 1} Năm kinh nghiệm</option>
                                ))}
                            </select>
                        </div>

                        {/* Chuyên khoa */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-600">Chuyên khoa</label>
                            <select 
                                name="speciality" 
                                value={formData.speciality} 
                                onChange={handleChange} 
                                className="w-full border rounded px-3 py-2 focus:border-primary outline-none"
                            >
                                <option value="Khoa Đa Khoa (Hô hấp/Chung)">Khoa Đa Khoa (Hô hấp/Chung)</option>
                                <option value="Khoa Tiêu Hóa">Khoa Tiêu Hóa</option>
                                <option value="Khoa Nhi (Trẻ em)">Khoa Nhi (Trẻ em)</option>
                                <option value="Khoa Thần Kinh">Khoa Thần Kinh</option>
                                <option value="Khoa Da Liễu">Khoa Da Liễu</option>
                                <option value="Khoa Cơ Xương Khớp">Khoa Cơ Xương Khớp</option>
                                <option value="Khoa Tim Mạch">Khoa Tim Mạch</option>
                            </select>
                        </div>

                        {/* Phí khám */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-600">Phí tư vấn (VND)</label>
                            <input
                                name="fees"
                                type="number"
                                value={formData.fees}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 focus:border-primary outline-none"
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-medium text-gray-600">Địa chỉ làm việc</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 focus:border-primary outline-none"
                            />
                        </div>

                        {/* Giới thiệu */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-medium text-gray-600">Giới thiệu bản thân</label>
                            <textarea
                                name="about"
                                rows="4"
                                value={formData.about}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 focus:border-primary outline-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-opacity-90 text-white px-10 py-3 rounded-full font-bold shadow-md transition-all"
                        >
                            Lưu Thay Đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;