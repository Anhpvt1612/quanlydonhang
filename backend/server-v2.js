const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../fronend')));

// Khởi tạo database
const db = new Database('orders.db');

// Tạo bảng users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Tạo bảng orders với user_id
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_code TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_status TEXT NOT NULL CHECK(payment_status IN ('paid', 'unpaid')),
    payment_method TEXT CHECK(payment_method IN ('bank_transfer', 'cash', 'later')),
    note TEXT,
    order_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, order_code)
  )
`);

// Tạo bảng activity_log
db.exec(`
  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, full_name } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username và password là bắt buộc' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)');
    const info = stmt.run(username, hashedPassword, full_name || username);

    res.json({ success: true, message: 'Đăng ký thành công', user_id: info.lastInsertRowid });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      res.status(400).json({ success: false, message: 'Username đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username và password là bắt buộc' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Username hoặc password không đúng' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Username hoặc password không đúng' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Đăng xuất thành công' });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, full_name, created_at FROM users WHERE id = ?').get(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ORDERS ROUTES
// ============================================

// Get all orders with filters
app.get('/api/orders', authenticateToken, (req, res) => {
  const { start_date, end_date, payment_status, sort_by, sort_order, search } = req.query;
  
  let query = 'SELECT * FROM orders WHERE user_id = ?';
  const params = [req.user.id];

  if (start_date) {
    query += ' AND order_date >= ?';
    params.push(start_date);
  }

  if (end_date) {
    query += ' AND order_date <= ?';
    params.push(end_date);
  }

  if (payment_status) {
    query += ' AND payment_status = ?';
    params.push(payment_status);
  }

  if (search) {
    query += ' AND (order_code LIKE ? OR note LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const sortBy = sort_by || 'created_at';
  const sortOrder = sort_order || 'DESC';
  query += ` ORDER BY ${sortBy} ${sortOrder}`;

  try {
    const orders = db.prepare(query).all(...params);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get orders by date range
app.get('/api/orders/by-date', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT 
        DATE(order_date) as date,
        COUNT(*) as total_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN payment_status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_orders,
        SUM(amount) as total_amount,
        SUM(CASE WHEN payment_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN payment_status = 'unpaid' THEN amount ELSE 0 END) as unpaid_amount
      FROM orders 
      WHERE user_id = ?
      GROUP BY DATE(order_date)
      ORDER BY date DESC
    `).all(req.user.id);
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create order
app.post('/api/orders', authenticateToken, (req, res) => {
  const { order_code, amount, payment_status, payment_method, note, order_date } = req.body;

  if (!order_code || !amount) {
    return res.status(400).json({ success: false, message: 'Mã đơn hàng và số tiền là bắt buộc' });
  }

  const finalOrderDate = order_date || new Date().toISOString().split('T')[0];

  try {
    const stmt = db.prepare(`
      INSERT INTO orders (user_id, order_code, amount, payment_status, payment_method, note, order_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      req.user.id,
      order_code,
      parseFloat(amount),
      payment_status,
      payment_method || null,
      note || null,
      finalOrderDate
    );
    
    const newOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid);
    
    // Log activity
    db.prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)').run(
      req.user.id,
      'create',
      'order',
      info.lastInsertRowid
    );
    
    res.json({ success: true, data: newOrder });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      res.status(400).json({ success: false, message: 'Mã đơn hàng đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// Update order
app.put('/api/orders/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { payment_status, payment_method, note, amount, order_date } = req.body;
  
  try {
    const stmt = db.prepare(`
      UPDATE orders 
      SET payment_status = COALESCE(?, payment_status),
          payment_method = COALESCE(?, payment_method),
          note = COALESCE(?, note),
          amount = COALESCE(?, amount),
          order_date = COALESCE(?, order_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);
    
    const info = stmt.run(payment_status, payment_method, note, amount, order_date, id, req.user.id);
    
    if (info.changes === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    
    // Log activity
    db.prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)').run(
      req.user.id,
      'update',
      'order',
      id
    );
    
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete order
app.delete('/api/orders/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  try {
    const stmt = db.prepare('DELETE FROM orders WHERE id = ? AND user_id = ?');
    const info = stmt.run(id, req.user.id);
    
    if (info.changes === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    
    // Log activity
    db.prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)').run(
      req.user.id,
      'delete',
      'order',
      id
    );
    
    res.json({ success: true, message: 'Đã xóa đơn hàng' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk delete
app.post('/api/orders/bulk-delete', authenticateToken, (req, res) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'IDs không hợp lệ' });
  }
  
  try {
    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`DELETE FROM orders WHERE id IN (${placeholders}) AND user_id = ?`);
    const info = stmt.run(...ids, req.user.id);
    
    res.json({ success: true, message: `Đã xóa ${info.changes} đơn hàng` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stats
app.get('/api/stats', authenticateToken, (req, res) => {
  try {
    const stats = {
      total_orders: db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ?').get(req.user.id).count,
      paid_orders: db.prepare("SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND payment_status = 'paid'").get(req.user.id).count,
      unpaid_orders: db.prepare("SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND payment_status = 'unpaid'").get(req.user.id).count,
      total_amount: db.prepare('SELECT SUM(amount) as total FROM orders WHERE user_id = ?').get(req.user.id).total || 0,
      paid_amount: db.prepare("SELECT SUM(amount) as total FROM orders WHERE user_id = ? AND payment_status = 'paid'").get(req.user.id).total || 0,
      unpaid_amount: db.prepare("SELECT SUM(amount) as total FROM orders WHERE user_id = ? AND payment_status = 'unpaid'").get(req.user.id).total || 0,
      today_orders: db.prepare("SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND DATE(order_date) = DATE('now')").get(req.user.id).count,
      today_amount: db.prepare("SELECT SUM(amount) as total FROM orders WHERE user_id = ? AND DATE(order_date) = DATE('now')").get(req.user.id).total || 0
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export data
app.get('/api/export', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC, created_at DESC').all(req.user.id);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fronend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('exit', () => db.close());
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
