import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const About = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 text-gray-500'>
              <p>VỀ <span className='text-gray-700 font-medium'>CHÚNG TÔI</span></p>
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[300px]' src={assets.about_image} alt ="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                    <p>Chào mừng bạn đến với Bloom, đối tác tin cậy trong việc quản lý nhu cầu chăm sóc sức khỏe một cách thuận tiện và hiệu quả. Tại Bloom, chúng tôi thấu hiểu những thách thức mà mọi người phải đối mặt khi đặt lịch hẹn bác sĩ và quản lý hồ sơ sức khỏe.</p>
                    <p>Bloom cam kết mang lại sự xuất sắc trong công nghệ y tế. Chúng tôi không ngừng nỗ lực hoàn thiện nền tảng, tích hợp những tiến bộ mới nhất để cải thiện trải nghiệm người dùng và cung cấp dịch vụ vượt trội. Dù bạn đặt lịch hẹn lần đầu hay đang quản lý quá trình điều trị lâu dài, Bloom luôn ở đây để hỗ trợ bạn trên từng bước đi.</p>
                    <b className='text-gray-800'>Tầm Nhìn Của Chúng Tôi</b>
                    <p>Tầm nhìn của chúng tôi tại Bloom là tạo ra trải nghiệm chăm sóc sức khỏe liền mạch cho mọi người dùng. Chúng tôi hướng tới việc thu hẹp khoảng cách giữa bệnh nhân và các nhà cung cấp dịch vụ y tế, giúp bạn tiếp cận dịch vụ chăm sóc cần thiết dễ dàng hơn, bất cứ khi nào bạn cần.</p>
                </div>
            </div>

            <div className='text-xl my-4'>
                <p>TẠI SAO <span className='text-gray-700 font-semibold'>CHỌN CHÚNG TÔI</span></p>
            </div>

            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Hiệu Quả:</b>
                    <p>Quy trình đặt lịch hẹn được tối ưu hóa, phù hợp với lối sống bận rộn của bạn.</p>
                </div>
                
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                <b>Tiện Lợi:</b>
                    <p>Tiếp cận mạng lưới các chuyên gia y tế đáng tin cậy ngay tại khu vực của bạn.</p>
                </div>

                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                <b>Cá Nhân Hóa:</b>
                    <p>Các đề xuất và nhắc nhở được tùy chỉnh để giúp bạn luôn nắm bắt tốt tình trạng sức khỏe của mình.</p>
                </div>
            </div>
        </div>
        
    )
}

export default About