import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const DoctorForm = ({ doctor, onClose, onUpdate }) => {
  const { backendUrl, aToken } = useContext(AdminContext);

  // States cho form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fees, setFees] = useState("");
  const [avatar, setAvatar] = useState(null); // File object để upload
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null); // URL ảnh hiện tại từ server
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("Khoa Đa Khoa (Hô hấp/Chung)");
  const [address, setAddress] = useState("");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("1 Năm");

  // Danh sách chuyên khoa đồng bộ với Database/Filter
  const specialities = [
    "Khoa Đa Khoa (Hô hấp/Chung)",
    "Khoa Tiêu Hóa",
    "Khoa Nhi (Trẻ em)",
    "Khoa Thần Kinh",
    "Khoa Da Liễu",
    "Khoa Cơ Xương Khớp",
    "Khoa Tim Mạch",
  ];

  useEffect(() => {
    if (doctor) {
      setName(doctor.name || "");
      setEmail(doctor.email || "");
      setFees(doctor.fees || "");
      setAbout(doctor.about || "");
      setSpeciality(doctor.speciality || "Khoa Đa Khoa (Hô hấp/Chung)");
      setAddress(doctor.address || "");
      setDegree(doctor.degree || "");
      setExperience(doctor.experience || "1 Năm");
      
      // Nếu có avatar_url từ server, thêm backendUrl vào để hiển thị
      if (doctor.avatar_url) {
        setCurrentAvatarUrl(`${backendUrl}${doctor.avatar_url}`);
      }
    }
  }, [doctor, backendUrl]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!doctor) {
      return toast.error("Không tìm thấy thông tin bác sĩ");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("fees", fees);
    formData.append("about", about);
    formData.append("speciality", speciality);
    formData.append("address", address);
    formData.append("degree", degree);
    formData.append("experience", experience);

    // Chỉ gửi ảnh nếu người dùng chọn file mới
    if (avatar) {
      formData.append("image", avatar);
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admins/doctors/${doctor.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Cập nhật bác sĩ thành công");
        onUpdate(); // Load lại danh sách ở component cha
        onClose();  // Đóng form/modal
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật");
    }
  };

  return (
    <div className="p-6 bg-white border rounded-xl shadow-lg max-w-3xl mx-auto my-4 overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin bác sĩ</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <form onSubmit={onSubmitHandler}>
        {/* Khu vực ảnh đại diện */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <label htmlFor="avatar-upload" className="relative cursor-pointer group">
            <img
              src={avatar ? URL.createObjectURL(avatar) : currentAvatarUrl || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-primary group-hover:opacity-80 transition-all"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">Thay đổi</span>
            </div>
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="hidden"
          />
          <p className="text-xs text-gray-500">Định dạng: JPG, PNG. Dung lượng &lt; 2MB</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cột 1 */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm mb-1 font-medium">Tên bác sĩ</p>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 outline-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <p className="text-sm mb-1 font-medium">Email</p>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 outline-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <p className="text-sm mb-1 font-medium">Phí khám (VNĐ)</p>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 outline-primary"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm mb-1 font-medium">Chuyên khoa</p>
              <select
                className="w-full border rounded px-3 py-2 outline-primary"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                {specialities.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm mb-1 font-medium">Bằng cấp</p>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 outline-primary"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>

            <div>
              <p className="text-sm mb-1 font-medium">Kinh nghiệm</p>
              <select
                className="w-full border rounded px-3 py-2 outline-primary"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Năm`}>{i + 1} Năm</option>
                ))}
                <option value="Trên 10 Năm">Trên 10 Năm</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm mb-1 font-medium">Địa chỉ phòng khám</p>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 outline-primary"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <p className="text-sm mb-1 font-medium">Giới thiệu bản thân</p>
          <textarea
            rows={4}
            className="w-full border rounded px-3 py-2 outline-primary"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>

        <div className="flex justify-end mt-8 gap-4">
          <button
            type="button"
            className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-all"
            onClick={onClose}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-8 py-2 rounded-full bg-primary text-white hover:bg-opacity-90 transition-all"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;