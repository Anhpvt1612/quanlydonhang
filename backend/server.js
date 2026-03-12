const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../fronend")));

// Khởi tạo database
const db = new Database("orders.db");

// Tạo bảng orders nếu chưa tồn tại
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT NOT NULL UNIQUE,
    amount REAL NOT NULL,
    payment_status TEXT NOT NULL CHECK(payment_status IN ('paid', 'unpaid')),
    payment_method TEXT CHECK(payment_method IN ('bank_transfer', 'cash', 'later')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API Routes

// 1. Lấy tất cả đơn hàng
app.get("/api/orders", (req, res) => {
  try {
    const orders = db
      .prepare("SELECT * FROM orders ORDER BY created_at DESC")
      .all();
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Tạo đơn hàng mới
app.post("/api/orders", (req, res) => {
  const { order_code, amount, payment_status, payment_method } = req.body;

  // Validate input
  if (!order_code || !amount) {
    return res.status(400).json({
      success: false,
      message: "Mã đơn hàng và số tiền là bắt buộc",
    });
  }

  if (!payment_status || !["paid", "unpaid"].includes(payment_status)) {
    return res.status(400).json({
      success: false,
      message: "Trạng thái thanh toán không hợp lệ",
    });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO orders (order_code, amount, payment_status, payment_method)
      VALUES (?, ?, ?, ?)
    `);

    const info = stmt.run(
      order_code,
      parseFloat(amount),
      payment_status,
      payment_method || null,
    );

    const newOrder = db
      .prepare("SELECT * FROM orders WHERE id = ?")
      .get(info.lastInsertRowid);

    res.json({ success: true, data: newOrder });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      res.status(400).json({
        success: false,
        message: "Mã đơn hàng đã tồn tại",
      });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// 3. Cập nhật đơn hàng
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { payment_status, payment_method } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE orders 
      SET payment_status = ?, 
          payment_method = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const info = stmt.run(payment_status, payment_method || null, id);

    if (info.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    const updatedOrder = db
      .prepare("SELECT * FROM orders WHERE id = ?")
      .get(id);
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Tìm kiếm đơn hàng
app.get("/api/orders/search", (req, res) => {
  const { order_code, amount, min_amount, max_amount } = req.query;

  let query = "SELECT * FROM orders WHERE 1=1";
  const params = [];

  if (order_code) {
    query += " AND order_code LIKE ?";
    params.push(`%${order_code}%`);
  }

  if (amount) {
    query += " AND amount = ?";
    params.push(parseFloat(amount));
  }

  if (min_amount) {
    query += " AND amount >= ?";
    params.push(parseFloat(min_amount));
  }

  if (max_amount) {
    query += " AND amount <= ?";
    params.push(parseFloat(max_amount));
  }

  query += " ORDER BY created_at DESC";

  try {
    const orders = db.prepare(query).all(...params);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Xóa đơn hàng
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare("DELETE FROM orders WHERE id = ?");
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({ success: true, message: "Đã xóa đơn hàng" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Thống kê
app.get("/api/stats", (req, res) => {
  try {
    const stats = {
      total_orders: db.prepare("SELECT COUNT(*) as count FROM orders").get()
        .count,
      paid_orders: db
        .prepare(
          "SELECT COUNT(*) as count FROM orders WHERE payment_status = 'paid'",
        )
        .get().count,
      unpaid_orders: db
        .prepare(
          "SELECT COUNT(*) as count FROM orders WHERE payment_status = 'unpaid'",
        )
        .get().count,
      total_amount:
        db.prepare("SELECT SUM(amount) as total FROM orders").get().total || 0,
      paid_amount:
        db
          .prepare(
            "SELECT SUM(amount) as total FROM orders WHERE payment_status = 'paid'",
          )
          .get().total || 0,
      unpaid_amount:
        db
          .prepare(
            "SELECT SUM(amount) as total FROM orders WHERE payment_status = 'unpaid'",
          )
          .get().total || 0,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../fronend/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("exit", () => db.close());
process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
