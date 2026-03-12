/* ========================================
   QuanLyDonHang Pro v2.0 - Application Logic
   Modern, Feature-Rich JavaScript
   ======================================== */

// API Configuration
const API_URL = window.location.origin;
const API = {
  // Auth endpoints
  register: `${API_URL}/api/auth/register`,
  login: `${API_URL}/api/auth/login`,
  logout: `${API_URL}/api/auth/logout`,
  
  // Orders endpoints
  orders: `${API_URL}/api/orders`,
  ordersByDate: `${API_URL}/api/orders/by-date`,
  bulkDelete: `${API_URL}/api/orders/bulk-delete`,
  stats: `${API_URL}/api/stats`,
  export: `${API_URL}/api/export`,
};

// Global State
let currentUser = null;
let currentView = 'dashboard';
let orders = [];
let selectedOrders = new Set();
let filters = {
  search: '',
  status: '',
  startDate: '',
  endDate: '',
  sortBy: 'created_at',
  sortOrder: 'desc'
};

// ========================================
// Utility Functions
// ========================================

// HTTP Request Helper
async function fetchAPI(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Toast Notification
function showToast(message, type = 'info', title = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'check-circle',
    error: 'alert-circle',
    info: 'info',
  };
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i data-lucide="${icons[type]}"></i>
    </div>
    <div class="toast-content">
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

// Format Date
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// ========================================
// Authentication
// ========================================

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
});

// Check Authentication Status
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    currentUser = JSON.parse(user);
    showApp();
    loadDashboard();
  } else {
    showAuth();
  }
}

// Show Auth Screen
function showAuth() {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('appContainer').classList.add('hidden');
}

// Show App Screen
function showApp() {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
  updateUserMenu();
}

// Switch Auth Tab
window.switchAuthTab = (tab) => {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  
  tabs.forEach(t => t.classList.remove('active'));
  forms.forEach(f => f.classList.add('hidden'));
  
  document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
  document.getElementById(`${tab}Form`).classList.remove('hidden');
};

// Register
window.handleRegister = async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const fullName = document.getElementById('registerFullName').value;
  
  try {
    const data = await fetchAPI(API.register, {
      method: 'POST',
      body: JSON.stringify({ username, password, full_name: fullName }),
    });
    
    showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    switchAuthTab('login');
    document.getElementById('registerForm').reset();
  } catch (error) {
    showToast(error.message, 'error', 'Đăng ký thất bại');
  }
};

// Login
window.handleLogin = async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const data = await fetchAPI(API.login, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;
    
    showToast(`Chào mừng, ${data.user.full_name}!`, 'success');
    showApp();
    loadDashboard();
  } catch (error) {
    showToast(error.message, 'error', 'Đăng nhập thất bại');
  }
};

// Logout
window.handleLogout = async () => {
  try {
    await fetchAPI(API.logout, { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  showAuth();
  showToast('Đã đăng xuất', 'info');
};

// Update User Menu
function updateUserMenu() {
  if (currentUser) {
    document.getElementById('userName').textContent = currentUser.full_name;
    document.getElementById('userAvatar').textContent = currentUser.full_name.charAt(0).toUpperCase();
  }
}

// ========================================
// Navigation
// ========================================

// Setup Event Listeners
function setupEventListeners() {
  // Menu Toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });
  
  // User Menu Toggle
  document.getElementById('userMenuTrigger').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('userMenuDropdown').classList.toggle('hidden');
  });
  
  // Close user menu when clicking outside
  document.addEventListener('click', () => {
    document.getElementById('userMenuDropdown').classList.add('hidden');
  });
  
  // Filter Changes
  document.getElementById('searchInput').addEventListener('input', debounce(handleFilterChange, 300));
  document.getElementById('statusFilter').addEventListener('change', handleFilterChange);
  document.getElementById('startDate').addEventListener('change', handleFilterChange);
  document.getElementById('endDate').addEventListener('change', handleFilterChange);
  document.getElementById('sortBy').addEventListener('change', handleFilterChange);
  document.getElementById('sortOrder').addEventListener('change', handleFilterChange);
}

// Debounce Helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Navigate to View
window.navigateToView = (view) => {
  currentView = view;
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[onclick="navigateToView('${view}')"]`)?.classList.add('active');
  
  // Update views
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById(`${view}View`).classList.remove('hidden');
  
  // Load view data
  switch(view) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'orders':
      loadOrders();
      break;
    case 'calendar':
      loadCalendar();
      break;
    case 'analytics':
      loadAnalytics();
      break;
  }
};

// ========================================
// Dashboard
// ========================================

async function loadDashboard() {
  try {
    const stats = await fetchAPI(API.stats);
    
    // Update stat cards
    document.getElementById('totalOrders').textContent = stats.total_orders || 0;
    document.getElementById('totalPaid').textContent = formatCurrency(stats.total_paid || 0);
    document.getElementById('totalUnpaid').textContent = formatCurrency(stats.total_unpaid || 0);
    document.getElementById('todayOrders').textContent = stats.today_orders || 0;
    
  } catch (error) {
    showToast('Không thể tải thống kê', 'error');
  }
}

// ========================================
// Orders Management
// ========================================

async function loadOrders() {
  try {
    // Build query params
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('payment_status', filters.status);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    params.append('sort_by', filters.sortBy);
    params.append('sort_order', filters.sortOrder);
    
    const data = await fetchAPI(`${API.orders}?${params}`);
    orders = data.orders || [];
    
    renderOrders();
  } catch (error) {
    showToast('Không thể tải đơn hàng', 'error');
  }
}

function renderOrders() {
  const tbody = document.getElementById('ordersTableBody');
  
  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i data-lucide="package"></i>
            </div>
            <h3>Chưa có đơn hàng</h3>
            <p>Thêm đơn hàng đầu tiên của bạn</p>
            <button class="btn btn-primary" onclick="showAddOrderModal()">
              <i data-lucide="plus"></i>
              Thêm đơn hàng
            </button>
          </div>
        </td>
      </tr>
    `;
    lucide.createIcons();
    return;
  }
  
  tbody.innerHTML = orders.map(order => `
    <tr class="${selectedOrders.has(order.id) ? 'selected' : ''}">
      <td>
        <input 
          type="checkbox" 
          ${selectedOrders.has(order.id) ? 'checked' : ''}
          onchange="toggleOrderSelection(${order.id})"
        >
      </td>
      <td><strong>${order.order_code}</strong></td>
      <td>${formatCurrency(order.amount)}</td>
      <td>
        <span class="status-badge ${order.payment_status}">
          ${order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
      </td>
      <td>${order.payment_method === 'bank_transfer' ? 'Chuyển khoản' : order.payment_method === 'cash' ? 'Tiền mặt' : 'Trả sau'}</td>
      <td>${order.order_date ? new Date(order.order_date).toLocaleDateString('vi-VN') : '-'}</td>
      <td>${order.note || '-'}</td>
      <td>
        <div class="order-actions">
          <button class="icon-btn" onclick="showEditOrderModal(${order.id})" title="Sửa">
            <i data-lucide="edit-2"></i>
          </button>
          <button class="icon-btn danger" onclick="deleteOrder(${order.id})" title="Xóa">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  lucide.createIcons();
  updateBulkActions();
}

// Handle Filter Changes
function handleFilterChange() {
  filters.search = document.getElementById('searchInput').value;
  filters.status = document.getElementById('statusFilter').value;
  filters.startDate = document.getElementById('startDate').value;
  filters.endDate = document.getElementById('endDate').value;
  filters.sortBy = document.getElementById('sortBy').value;
  filters.sortOrder = document.getElementById('sortOrder').value;
  
  loadOrders();
}

// Clear Filters
window.clearFilters = () => {
  document.getElementById('searchInput').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  document.getElementById('sortBy').value = 'created_at';
  document.getElementById('sortOrder').value = 'desc';
  
  filters = {
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  };
  
  loadOrders();
};

// Toggle Order Selection
window.toggleOrderSelection = (orderId) => {
  if (selectedOrders.has(orderId)) {
    selectedOrders.delete(orderId);
  } else {
    selectedOrders.add(orderId);
  }
  renderOrders();
};

// Update Bulk Actions
function updateBulkActions() {
  const bulkActions = document.getElementById('bulkActions');
  const count = document.getElementById('selectedCount');
  
  if (selectedOrders.size > 0) {
    bulkActions.classList.remove('hidden');
    count.textContent = selectedOrders.size;
  } else {
    bulkActions.classList.add('hidden');
  }
}

// Clear Selection
window.clearSelection = () => {
  selectedOrders.clear();
  renderOrders();
};

// Bulk Delete
window.bulkDelete = async () => {
  if (!confirm(`Xóa ${selectedOrders.size} đơn hàng đã chọn?`)) return;
  
  try {
    await fetchAPI(API.bulkDelete, {
      method: 'POST',
      body: JSON.stringify({ order_ids: Array.from(selectedOrders) }),
    });
    
    showToast(`Đã xóa ${selectedOrders.size} đơn hàng`, 'success');
    selectedOrders.clear();
    loadOrders();
    loadDashboard();
  } catch (error) {
    showToast('Không thể xóa đơn hàng', 'error');
  }
};

// ========================================
// Order CRUD Operations
// ========================================

// Show Add Order Modal
window.showAddOrderModal = () => {
  document.getElementById('orderModalTitle').textContent = 'Thêm đơn hàng mới';
  document.getElementById('orderForm').reset();
  document.getElementById('orderId').value = '';
  document.getElementById('orderDate').valueAsDate = new Date();
  document.getElementById('orderModal').classList.remove('hidden');
};

// Show Edit Order Modal
window.showEditOrderModal = async (orderId) => {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  
  document.getElementById('orderModalTitle').textContent = 'Chỉnh sửa đơn hàng';
  document.getElementById('orderId').value = order.id;
  document.getElementById('orderCode').value = order.order_code;
  document.getElementById('amount').value = order.amount;
  document.getElementById('paymentStatus').value = order.payment_status;
  document.getElementById('paymentMethod').value = order.payment_method;
  document.getElementById('orderDate').value = order.order_date ? order.order_date.split('T')[0] : '';
  document.getElementById('note').value = order.note || '';
  
  document.getElementById('orderModal').classList.remove('hidden');
};

// Close Modal
window.closeModal = (modalId) => {
  document.getElementById(modalId).classList.add('hidden');
};

// Save Order
window.saveOrder = async (e) => {
  e.preventDefault();
  
  const orderId = document.getElementById('orderId').value;
  const orderData = {
    order_code: document.getElementById('orderCode').value,
    amount: parseFloat(document.getElementById('amount').value),
    payment_status: document.getElementById('paymentStatus').value,
    payment_method: document.getElementById('paymentMethod').value,
    order_date: document.getElementById('orderDate').value,
    note: document.getElementById('note').value,
  };
  
  try {
    if (orderId) {
      // Update
      await fetchAPI(`${API.orders}/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
      });
      showToast('Đã cập nhật đơn hàng', 'success');
    } else {
      // Create
      await fetchAPI(API.orders, {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      showToast('Đã thêm đơn hàng mới', 'success');
    }
    
    closeModal('orderModal');
    loadOrders();
    loadDashboard();
  } catch (error) {
    showToast(error.message, 'error', 'Lỗi');
  }
};

// Delete Order
window.deleteOrder = async (orderId) => {
  if (!confirm('Xóa đơn hàng này?')) return;
  
  try {
    await fetchAPI(`${API.orders}/${orderId}`, {
      method: 'DELETE',
    });
    
    showToast('Đã xóa đơn hàng', 'success');
    loadOrders();
    loadDashboard();
  } catch (error) {
    showToast('Không thể xóa đơn hàng', 'error');
  }
};

// ========================================
// Export Functionality
// ========================================

window.showExportModal = () => {
  document.getElementById('exportModal').classList.remove('hidden');
};

window.handleExport = async (format) => {
  try {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('payment_status', filters.status);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    const response = await fetch(`${API.export}?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    closeModal('exportModal');
    showToast(`Đã xuất file ${format.toUpperCase()}`, 'success');
  } catch (error) {
    showToast('Không thể xuất dữ liệu', 'error');
  }
};

// ========================================
// Calendar View (Placeholder)
// ========================================

async function loadCalendar() {
  try {
    const data = await fetchAPI(API.ordersByDate);
    // TODO: Implement calendar view with data.orders_by_date
    console.log('Calendar data:', data);
  } catch (error) {
    showToast('Không thể tải lịch', 'error');
  }
}

// ========================================
// Analytics View (Placeholder)
// ========================================

async function loadAnalytics() {
  try {
    const stats = await fetchAPI(API.stats);
    // TODO: Implement charts and analytics with stats data
    console.log('Analytics data:', stats);
  } catch (error) {
    showToast('Không thể tải phân tích', 'error');
  }
}

// ========================================
// Service Worker Registration (PWA)
// ========================================

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered'))
    .catch(err => console.log('Service Worker registration failed'));
}
