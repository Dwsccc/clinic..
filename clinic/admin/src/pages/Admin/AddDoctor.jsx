import React, { useContext, useState } from "react";
import { assets } from "../../assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Năm'); // Sửa mặc định thành tiếng Việt
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  
  // 👇 QUAN TRỌNG: Giá trị mặc định phải trùng với option đầu tiên
  const [speciality, setSpeciality] = useState('Khoa Đa Khoa (Hô hấp/Chung)'); 
  
  const [address, setAddress] = useState('');
  const [degree, setDegree] = useState('');
  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error('Vui lòng chọn ảnh đại diện');
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees)); // Đảm bảo fees là số
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', address);

      const { data } = await axios.post(`${backendUrl}/api/admins/doctors`, formData, {
        headers: {
          'Authorization': `Bearer ${aToken}`,
          'Content-Type': 'multipart/form-data', // Không bắt buộc khai báo thủ công với axios nhưng nên giữ cho rõ ràng
        },
      });

      if (data.success) {
        toast.success("Thêm bác sĩ thành công!");
        // Reset form
        setDocImg(null);
        setName('');
        setPassword('');
        setEmail('');
        setAddress('');
        setDegree('');
        setAbout('');
        setFees('');
        setExperience('1 Năm');
        setSpeciality('Khoa Đa Khoa (Hô hấp/Chung)');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('AddDoctor error:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi thêm bác sĩ');
    }
  };

  return (
    <form className="m-5 flex-1" onSubmit={onSubmitHandler}>
      <p className="mb-3 text-lg font-medium">Thêm Bác Sĩ</p>
      
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        
        {/* Upload ảnh */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="doctor"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>Tải ảnh <br /> đại diện</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Cột trái */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            
            <div className="flex-1 flex flex-col gap-1">
              <p>Họ tên bác sĩ</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Nhập tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Email</p>
              <input
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Mật khẩu</p>
              <input
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Kinh nghiệm</p>
              <select
                className="border rounded px-3 py-2"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Năm`}>
                    {i + 1} Năm
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Giá khám (VNĐ)</p>
              <input
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Ví dụ: 500000"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Cột phải */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            
            <div className="flex-1 flex flex-col gap-1">
              <p>Chuyên khoa</p>
              <select
                className="border rounded px-3 py-2"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                {/* 👇 DANH SÁCH CHUYÊN KHOA KHỚP VỚI FRONTEND */}
                <option value="Khoa Đa Khoa (Hô hấp/Chung)">Khoa Đa Khoa (Hô hấp/Chung)</option>
                <option value="Khoa Tiêu Hóa">Khoa Tiêu Hóa</option>
                <option value="Khoa Nhi (Trẻ em)">Khoa Nhi (Trẻ em)</option>
                <option value="Khoa Thần Kinh">Khoa Thần Kinh</option>
                <option value="Khoa Da Liễu">Khoa Da Liễu</option>
                <option value="Khoa Cơ Xương Khớp">Khoa Cơ Xương Khớp</option>
                <option value="Khoa Tim Mạch">Khoa Tim Mạch</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Bằng cấp</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Ví dụ: Thạc sĩ, Tiến sĩ..."
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Địa chỉ phòng khám</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Nhập địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* About Doctor */}
        <div className="mt-4">
          <p className="mb-2">Giới thiệu bác sĩ</p>
          <textarea
            className="w-full px-4 pt-2 border rounded"
            placeholder="Viết mô tả ngắn về bác sĩ, kinh nghiệm, thành tích..."
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>

        <button className="bg-primary px-10 py-2 mt-4 text-white rounded-full hover:bg-primary-dark transition-all" type="submit">
          Lưu thông tin
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;