import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
  const { token, backendUrl } = useContext(UserContext) // Giả sử backendUrl có trong Context
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // URL dự phòng nếu context chưa có
  const url = backendUrl || 'http://localhost:3000'

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${url}/api/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch hẹn:', error)
      toast.error("Không thể tải danh sách lịch hẹn")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchAppointments()
    }
  }, [token])

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return

    try {
      const { data } = await axios.delete(`${url}/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success('Hủy lịch hẹn thành công')
        fetchAppointments() // Tải lại để đồng bộ trạng thái từ server
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi hủy lịch hẹn')
    }
  }

  const handleFakePayment = async (id, amount) => {
    if (!window.confirm(`Xác nhận thanh toán ${Number(amount).toLocaleString()}đ?`)) return

    try {
      const { data } = await axios.post(`${url}/api/payments`, 
        { appointment_id: id, amount, method: 'cash' },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success('Thanh toán thành công!')
        fetchAppointments()
      }
    } catch (error) {
      toast.error('Thanh toán thất bại')
    }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Đang tải dữ liệu...</div>

  // Chia lịch hẹn
  const now = new Date()
  const currentAppointments = appointments.filter(appt => new Date(appt.start_time) >= now)
  const pastAppointments = appointments.filter(appt => new Date(appt.start_time) < now)

  // Reusable Component cho dòng lịch hẹn
  const AppointmentItem = ({ appt, isPast }) => {
    const { doctor, start_time, id, status, payment_status } = appt
    if (!doctor) return null

    const datetime = new Date(start_time)
    const formattedDate = datetime.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
    const formattedTime = datetime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

    return (
      <div key={id} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b hover:bg-gray-50 transition-all px-2">
        <div>
          <img
            className="w-32 h-32 object-cover rounded-lg bg-indigo-50 border"
            src={doctor.avatar_url ? `${url}${doctor.avatar_url}` : '/default-avatar.png'}
            alt={doctor.name}
          />
        </div>
        
        <div className="flex-1 text-sm text-zinc-600">
          <p className="text-neutral-800 font-bold text-base">{doctor.name}</p>
          <p className="text-indigo-600 font-medium">{doctor.speciality}</p>
          <p className="mt-2"><span className="font-medium text-neutral-700">Địa chỉ:</span> {doctor.address || 'Tại phòng khám'}</p>
          <p className="mt-1"><span className="font-medium text-neutral-700">Thời gian:</span> <span className="text-black">{formattedTime} - {formattedDate}</span></p>
          
          <div className="mt-2 flex flex-wrap gap-4">
            <p>
              <span className="font-medium text-neutral-700">Trạng thái: </span>
              <span className={`font-bold ${status === 'confirmed' ? 'text-green-600' : status === 'pending' ? 'text-blue-500' : 'text-red-500'}`}>
                {status === 'confirmed' ? '● Đã xác nhận' : status === 'pending' ? '○ Chờ xác nhận' : '✕ Đã hủy'}
              </span>
            </p>
            <p>
              <span className="font-medium text-neutral-700">Thanh toán: </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {payment_status === 'paid' ? 'Đã trả phí' : 'Chưa thanh toán'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-end min-w-40">
          {/* Nút thanh toán: Chỉ hiện khi Admin đã xác nhận và chưa trả tiền */}
          {status === 'confirmed' && payment_status !== 'paid' && !isPast && (
            <button
              onClick={() => handleFakePayment(id, doctor.fees)}
              className="text-sm bg-primary text-white py-2 rounded border border-primary hover:bg-opacity-90 transition-all"
            >
              Thanh toán ({Number(doctor.fees).toLocaleString()}đ)
            </button>
          )}

          {/* Nút hủy: Chỉ hiện khi chưa hủy và chưa trả tiền */}
          {status !== 'cancelled' && payment_status !== 'paid' && !isPast && (
            <button
              onClick={() => handleCancel(id)}
              className="text-sm text-gray-500 py-2 border rounded hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            >
              Hủy lịch hẹn
            </button>
          )}
          
          {isPast && <p className="text-center text-xs text-gray-400 italic py-2">Lịch hẹn đã kết thúc</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-10">
      <h1 className="pb-3 mt-12 font-bold text-2xl text-zinc-700 border-b">Lịch hẹn của tôi</h1>

      {appointments.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Bạn chưa có lịch hẹn nào.</div>
      ) : (
        <>
          <div className="mt-8">
            <h2 className="font-semibold text-lg text-indigo-900 mb-4">Lịch hẹn sắp tới</h2>
            <div className="border-t">
              {currentAppointments.length > 0 ? 
                currentAppointments.map(appt => <AppointmentItem key={appt.id} appt={appt} isPast={false} />) 
                : <p className="py-4 text-gray-400 italic">Không có lịch hẹn sắp tới.</p>
              }
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-semibold text-lg text-gray-500 mb-4">Lịch sử khám bệnh</h2>
            <div className="border-t bg-gray-50/50 rounded-lg">
              {pastAppointments.length > 0 ? 
                pastAppointments.map(appt => <AppointmentItem key={appt.id} appt={appt} isPast={true} />) 
                : <p className="py-4 text-gray-400 italic px-2">Chưa có lịch sử khám.</p>
              }
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MyAppointments