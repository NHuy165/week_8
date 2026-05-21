import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'
import './App.css'

function App() {
  const [customerName, setCustomerName] = useState('')
  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')

  const [orderId, setOrderId] = useState(null)
  const [qrUrl, setQrUrl] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [orders, setOrders] = useState([])

  // --- PHẦN 5: LẮNG NGHE DỮ LIỆU REAL-TIME TỪ FIRESTORE ---
  useEffect(() => {
    // onSnapshot sẽ tự động chạy lần đầu khi mở web,
    // VÀ tự động chạy lại mỗi khi database có bất kỳ thay đổi nào (thêm/sửa/xóa)
    const unsubscribe = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const ordersList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))

        // Sắp xếp đơn hàng mới tạo lên đầu bảng
        ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setOrders(ordersList) // Cập nhật state an toàn trong callback
      },
      (error) => {
        console.error('Lỗi khi lắng nghe đơn hàng:', error)
      },
    )

    // Cleanup function: Hủy lắng nghe khi tắt component để tránh rò rỉ bộ nhớ
    return () => unsubscribe()
  }, [])

  // --- PHẦN 2: HÀM TẠO ĐƠN HÀNG MỚI ---
  const handleCreateOrder = async (e) => {
    e.preventDefault()

    try {
      const ordersCollection = collection(db, 'orders')

      const docRef = await addDoc(ordersCollection, {
        customerName: customerName,
        product: product,
        amount: Number(amount),
        status: 'pending',
        createdAt: new Date().toISOString(),
      })

      console.log('Document created with ID: ', docRef.id)

      const url = `https://img.vietqr.io/image/970422-123456789-compact2.png?amount=${amount}&addInfo=${docRef.id}`

      setOrderId(docRef.id)
      setQrUrl(url)
      setIsPaid(false)

      alert('Đã lưu đơn hàng thành công lên Firebase! Mã ID: ' + docRef.id)

      setCustomerName('')
      setProduct('')
      setAmount('')

      // KHÔNG CẦN gọi fetchOrders() ở đây nữa vì onSnapshot đã tự động cập nhật bảng!
    } catch (error) {
      console.error('Lỗi khi lưu lên Firebase: ', error)
      alert('Có lỗi xảy ra (Check console để xem chi tiết)')
    }
  }

  // --- PHẦN 4: HÀM XÁC NHẬN ĐÃ THANH TOÁN ---
  const handleConfirmPayment = async () => {
    if (!orderId) return

    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        status: 'paid',
      })

      setIsPaid(true)

      // KHÔNG CẦN gọi fetchOrders() ở đây nữa vì onSnapshot đã tự động cập nhật bảng!
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái thanh toán:', error)
      alert('Không thể cập nhật trạng thái!')
    }
  }

  return (
    <div className="app-container">
      <h2>Nhập thông tin đơn hàng</h2>

      <form onSubmit={handleCreateOrder}>
        <div className="form-group">
          <label>Họ tên khách hàng:</label>
          <input
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Sản phẩm:</label>
          <input
            type="text"
            placeholder="Ví dụ: Cà phê sữa đá"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Số tiền (VNĐ):</label>
          <input
            type="number"
            placeholder="Ví dụ: 35000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Tạo đơn hàng
        </button>
      </form>

      {orderId && qrUrl && (
        <div className="qr-section">
          <h3>Thanh toán đơn hàng</h3>
          <p>
            Mã đơn hàng: <strong>{orderId}</strong>
          </p>

          {!isPaid ? (
            <>
              <img src={qrUrl} alt="Mã QR Thanh Toán" />
              <p className="qr-hint">
                Người dùng có thể quét QR để thanh toán (mô phỏng).
              </p>
              <button onClick={handleConfirmPayment} className="confirm-btn">
                Xác nhận đã thanh toán
              </button>
            </>
          ) : (
            <p className="payment-success-msg">🎉 Thanh toán thành công</p>
          )}
        </div>
      )}

      <div className="orders-list-section">
        <h3>Danh sách đơn hàng</h3>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="order-id-cell">{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.product}</td>
                <td>{order.amount.toLocaleString('vi-VN')} đ</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>
                  Chưa có đơn hàng nào được tạo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
