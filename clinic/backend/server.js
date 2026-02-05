const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

// Sử dụng alter: true một lần để tạo bảng Payments, 
// sau khi xong nên đổi về alter: false để tránh lỗi Data Truncated như trên.
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database đã đồng bộ");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Lỗi đồng bộ Database:");
    console.error(err.message); 
    // Nếu vẫn lỗi gender, hãy chạy lệnh SQL ở Bước 1 rồi restart lại server.
  });