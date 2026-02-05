import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/*--------------left-section---------------*/}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt='' />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6 '>
                        Phòng khám của chúng tôi tại Việt Nam cam kết cung cấp dịch vụ chăm sóc sức khỏe chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại, luôn đặt sức khỏe của bạn lên hàng đầu.
                    </p>
                </div>
                {/*--------------center-section---------------*/}
                <div>
                    <p className='text-xl font-medium mb-5'>CÔNG TY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Trang chủ</li>
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Chính sách bảo mật</li>
                    </ul>
                </div>
                {/*--------------right-section---------------*/}
                <div>
                    <p className='text-xl font-medium mb-5'>LIÊN HỆ</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+84 0123-456-789</li>
                        <li>superclinic@gmail.com</li>
                    </ul>
                </div>
            </div>
            {/*Copyright----------------------*/}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Bản quyền 2024@ Bloom - Bảo lưu mọi quyền.</p>
            </div>
        </div>
    )
}

export default Footer