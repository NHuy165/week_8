import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase' // Import đối tượng db vừa tạo ở Bước 1

function App() {
  // State quản lý form (Phần 1)
  const [customerName, setCustomerName] = useState('')
  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')

  // Hàm lưu dữ liệu lên Firebase (Phần 2)
  const handleCreateOrder = async (e) => {
    e.preventDefault()

    try {
      // Trỏ vào collection (bảng) tên là 'orders'
      const ordersCollection = collection(db, 'orders')

      // Thực hiện insert document
      const docRef = await addDoc(ordersCollection, {
        customerName: customerName,
        product: product,
        amount: Number(amount), // Đảm bảo lưu đúng kiểu số
        status: 'pending',
        createdAt: new Date().toISOString(),
      })

      console.log('Document created with ID: ', docRef.id)
      alert('Đã lưu đơn hàng thành công lên Firebase! Mã ID: ' + docRef.id)
    } catch (error) {
      console.error('Lỗi khi lưu lên Firebase: ', error)
      alert('Có lỗi xảy ra (Check console để xem chi tiết)')
    }
  }

  return (
    <div>
      <h2>Nhập thông tin đơn hàng</h2>

      {/* Form giao diện (Phần 1) */}
      <form onSubmit={handleCreateOrder}>
        <div style={{ marginBottom: '10px' }}>
          <label>Họ tên khách hàng: </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Sản phẩm: </label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Số tiền: </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button type="submit">Tạo đơn hàng</button>
      </form>
    </div>
  )
}

export default App
