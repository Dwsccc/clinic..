import appointment_img from './appointment_img.png'
import Pediatricians from './Pediatricians.svg'; // Hoặc .png tùy file của bạn
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import default_avatar from './default_avatar.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import dakhoa from './dakhoa.png'; // Ảnh phổi và ống nghe
import dalieu from './dalieu.png'; // Ảnh nang lông và kính lúp
import nhi from './nhi.png'; // Ảnh em bé và bình sữa
import thankinh from './thankinh.png'; // Ảnh bộ não
import tieuhoa from './tieuhoa.png'; // Ảnh dạ dày và ruột
import coxuong from './coxuong.png'; // Ảnh bộ xương và bánh răng
import timmach from './timmach.png'; // Ảnh trái tim và điện tâm đồ

export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    default_avatar
}

export const specialityData = [
    {
        speciality: 'Khoa Đa Khoa (Hô hấp/Chung)',
        image: dakhoa // Dùng tạm hình General_physician
    },
    {
        speciality: 'Khoa Da Liễu',
        image: dalieu
    },
    {
        speciality: 'Khoa Nhi (Trẻ em)',
        image: nhi
    },
    {
        speciality: 'Khoa Thần Kinh',
        image: thankinh
    },
    {
        speciality: 'Khoa Tiêu Hóa',
        image: tieuhoa
    },
    // Nếu bạn chưa có icon cho Tim Mạch và Cơ Xương Khớp, 
    // bạn có thể dùng tạm hình General_physician hoặc thêm file ảnh mới
    {
        speciality: 'Khoa Cơ Xương Khớp', 
        image: coxuong // Cần thay icon phù hợp sau này
    },
    {
        speciality: 'Khoa Tim Mạch',
        image: timmach // Cần thay icon phù hợp sau này
    },
]
export const doctors = [
  {
    _id: 'doc1',
    name: 'BS. Nguyễn Văn Minh',
    image: doc1,
    speciality: 'Khoa Đa Khoa (Hô hấp/Chung)',
    degree: 'Bác sĩ Đa khoa',
    experience: '4 năm',
    about: 'Bác sĩ Minh có kinh nghiệm trong khám và điều trị các bệnh lý hô hấp, bệnh thông thường, chú trọng phòng ngừa và chẩn đoán sớm.',
    fees: 500000,
    address: {
      line1: '17 Nguyễn Văn Trỗi',
      line2: 'Quận Phú Nhuận, TP.HCM'
    }
  },
  {
    _id: 'doc2',
    name: 'BS. Trần Thị Lan',
    image: doc2,
    speciality: 'Khoa Đa Khoa (Hô hấp/Chung)',
    degree: 'Bác sĩ Đa khoa',
    experience: '3 năm',
    about: 'Bác sĩ Lan tận tâm trong khám bệnh tổng quát, theo dõi sức khỏe định kỳ và tư vấn phòng bệnh.',
    fees: 600000,
    address: {
      line1: '27 Lê Văn Sỹ',
      line2: 'Quận 3, TP.HCM'
    }
  },
  {
    _id: 'doc3',
    name: 'BS. Lê Hoàng Anh',
    image: doc3,
    speciality: 'Khoa Da Liễu',
    degree: 'Bác sĩ Da liễu',
    experience: '1 năm',
    about: 'Chuyên điều trị các bệnh lý da liễu như viêm da, mụn, dị ứng và tư vấn chăm sóc da.',
    fees: 300000,
    address: {
      line1: '37 Hai Bà Trưng',
      line2: 'Quận 1, TP.HCM'
    }
  },
  {
    _id: 'doc4',
    name: 'BS. Phạm Quốc Bảo',
    image: doc4,
    speciality: 'Khoa Nhi',
    degree: 'Bác sĩ Nhi khoa',
    experience: '2 năm',
    about: 'Bác sĩ chuyên khám và điều trị các bệnh thường gặp ở trẻ em, theo dõi sự phát triển toàn diện của trẻ.',
    fees: 400000,
    address: {
      line1: '47 Nguyễn Thị Minh Khai',
      line2: 'Quận 1, TP.HCM'
    }
  },
  {
    _id: 'doc5',
    name: 'BS. Võ Thanh Tùng',
    image: doc5,
    speciality: 'Khoa Thần Kinh',
    degree: 'Bác sĩ Chuyên khoa Thần kinh',
    experience: '4 năm',
    about: 'Có kinh nghiệm điều trị các bệnh lý thần kinh như đau đầu, rối loạn tiền đình, tai biến.',
    fees: 500000,
    address: {
      line1: '57 Điện Biên Phủ',
      line2: 'Quận Bình Thạnh, TP.HCM'
    }
  },
  {
    _id: 'doc6',
    name: 'BS. Nguyễn Thị Hồng',
    image: doc6,
    speciality: 'Khoa Thần Kinh',
    degree: 'Bác sĩ Chuyên khoa Thần kinh',
    experience: '4 năm',
    about: 'Tập trung điều trị và theo dõi dài hạn các bệnh lý thần kinh mạn tính.',
    fees: 500000,
    address: {
      line1: '57 Điện Biên Phủ',
      line2: 'Quận Bình Thạnh, TP.HCM'
    }
  }
]
