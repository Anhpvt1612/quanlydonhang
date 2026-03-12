// API Configuration
// Tự động detect API URL dựa trên environment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;

// State
let currentOrders = [];
let deferredPrompt = null;

// ========================================
// PWA Installation & Service Worker
// ========================================

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default prompt
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button
  const installButton = document.getElementById('installButton');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

// Handle install button click
document.addEventListener('DOMContentLoaded', () => {
  const installButton = document.getElementById('installButton');
  
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Show install prompt
        deferredPrompt.prompt();
        
        // Wait for user response
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          showToast('✅ Đang cài đặt ứng dụng...', 'success');
        }
        
        // Clear prompt
        deferredPrompt = null;
        installButton.style.display = 'none';
      } else {
        // For iOS or when prompt not available
        showIOSInstallInstructions();
      }
    });
  }
  
  // Check if running in standalone mode (already installed)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('✅ App is running in standalone mode');
  }
  
  // Detect iOS and show instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
  
  if (isIOS && !isInStandaloneMode && installButton) {
    // Show install button for iOS
    installButton.style.display = 'block';
    installButton.innerHTML = '📱 Cài Đặt trên iPhone';
  }
  
  loadStats();
  loadOrders();
});

// Show iOS installation instructions
function showIOSInstallInstructions() {
  const instructions = `
Để cài đặt ứng dụng trên iPhone/iPad:

1. Nhấn vào nút Chia sẻ (Share) ⬆️ ở dưới cùng
2. Cuộn xuống và chọn "Add to Home Screen" 
3. Nhấn "Add" để hoàn tất

Sau khi cài đặt, bạn có thể mở ứng dụng từ màn hình chính!
  `.trim();
  
  alert(instructions);
}

// Initialize

// Tab Switching
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(tabName + "Tab").classList.add("active");
  event.target.classList.add("active");

  // Load data for specific tabs
  if (tabName === "list") {
    loadOrders();
  }
}

// Toggle Payment Method visibility
function togglePaymentMethod(show) {
  const methodGroup = document.getElementById("paymentMethodGroup");
  if (show) {
    methodGroup.style.display = "block";
  } else {
    methodGroup.style.display = "none";
  }
}

// Add Order
async function addOrder(event) {
  event.preventDefault();

  const orderCode = document.getElementById("orderCode").value.trim();
  const amount = document.getElementById("amount").value;
  const paymentStatus = document.querySelector(
    'input[name="paymentStatus"]:checked',
  ).value;

  let paymentMethod = null;
  if (paymentStatus === "paid") {
    paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked',
    ).value;
  } else {
    paymentMethod = "later";
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_code: orderCode,
        amount: parseFloat(amount),
        payment_status: paymentStatus,
        payment_method: paymentMethod,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showToast("✅ Đã lưu đơn hàng thành công!", "success");
      document.getElementById("orderForm").reset();
      document.querySelector(
        'input[name="paymentStatus"][value="paid"]',
      ).checked = true;
      togglePaymentMethod(true);
      loadStats();
    } else {
      showToast("❌ " + data.message, "error");
    }
  } catch (error) {
    showToast("❌ Không thể kết nối đến server", "error");
    console.error("Error:", error);
  }
}

// Load Statistics
async function loadStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const data = await response.json();

    if (data.success) {
      const stats = data.data;
      document.getElementById("totalOrders").textContent = stats.total_orders;
      document.getElementById("paidAmount").textContent = formatCurrency(
        stats.paid_amount,
      );
      document.getElementById("unpaidAmount").textContent = formatCurrency(
        stats.unpaid_amount,
      );
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

// Load Orders
async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    const data = await response.json();

    if (data.success) {
      currentOrders = data.data;
      renderOrders(currentOrders, "ordersList");
    }
  } catch (error) {
    showToast("❌ Không thể tải danh sách đơn hàng", "error");
    console.error("Error:", error);
  }
}

// Render Orders
function renderOrders(orders, containerId) {
  const container = document.getElementById(containerId);

  if (orders.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="emoji">📭</div>
                <p>Chưa có đơn hàng nào</p>
            </div>
        `;
    return;
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <div class="order-card ${order.payment_status}">
            <div class="order-header">
                <div class="order-code">${order.order_code}</div>
                <span class="order-status ${order.payment_status}">
                    ${order.payment_status === "paid" ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"}
                </span>
            </div>
            <div class="order-amount">${formatCurrency(order.amount)}</div>
            <div class="order-details">
                <span>${formatDate(order.created_at)}</span>
                <span class="payment-method">
                    ${getPaymentMethodText(order.payment_method)}
                </span>
            </div>
            <div class="order-actions">
                <button class="btn-small btn-edit" onclick="updateOrderStatus(${order.id})">
                    ✏️ Cập nhật
                </button>
                <button class="btn-small btn-delete" onclick="deleteOrder(${order.id})">
                    🗑️ Xóa
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Search Orders
async function searchOrders() {
  const searchCode = document.getElementById("searchCode").value.trim();
  const searchAmount = document.getElementById("searchAmount").value;
  const minAmount = document.getElementById("minAmount").value;
  const maxAmount = document.getElementById("maxAmount").value;

  const params = new URLSearchParams();
  if (searchCode) params.append("order_code", searchCode);
  if (searchAmount) params.append("amount", searchAmount);
  if (minAmount) params.append("min_amount", minAmount);
  if (maxAmount) params.append("max_amount", maxAmount);

  try {
    const response = await fetch(
      `${API_BASE_URL}/orders/search?${params.toString()}`,
    );
    const data = await response.json();

    if (data.success) {
      renderOrders(data.data, "searchResults");
      if (data.data.length > 0) {
        showToast(`🔍 Tìm thấy ${data.data.length} đơn hàng`, "success");
      } else {
        showToast("🔍 Không tìm thấy đơn hàng nào", "error");
      }
    }
  } catch (error) {
    showToast("❌ Lỗi khi tìm kiếm", "error");
    console.error("Error:", error);
  }
}

// Clear Search
function clearSearch() {
  document.getElementById("searchCode").value = "";
  document.getElementById("searchAmount").value = "";
  document.getElementById("minAmount").value = "";
  document.getElementById("maxAmount").value = "";
  document.getElementById("searchResults").innerHTML = `
        <div class="empty-state">
            <div class="emoji">🔍</div>
            <p>Nhập thông tin để tìm kiếm</p>
        </div>
    `;
}

// Update Order Status
async function updateOrderStatus(orderId) {
  const order = currentOrders.find((o) => o.id === orderId);
  if (!order) return;

  const newStatus = order.payment_status === "paid" ? "unpaid" : "paid";
  let newMethod = "later";

  if (newStatus === "paid") {
    const method = prompt(
      "Chọn phương thức thanh toán:\n1 - Chuyển khoản\n2 - Tiền mặt",
      "1",
    );
    if (method === null) return; // User cancelled
    newMethod = method === "2" ? "cash" : "bank_transfer";
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_status: newStatus,
        payment_method: newMethod,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showToast("✅ Đã cập nhật đơn hàng", "success");
      loadOrders();
      loadStats();
    } else {
      showToast("❌ " + data.message, "error");
    }
  } catch (error) {
    showToast("❌ Không thể cập nhật", "error");
    console.error("Error:", error);
  }
}

// Delete Order
async function deleteOrder(orderId) {
  if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      showToast("✅ Đã xóa đơn hàng", "success");
      loadOrders();
      loadStats();
    } else {
      showToast("❌ " + data.message, "error");
    }
  } catch (error) {
    showToast("❌ Không thể xóa", "error");
    console.error("Error:", error);
  }
}

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getPaymentMethodText(method) {
  const methods = {
    bank_transfer: "🏦 Chuyển khoản",
    cash: "💵 Tiền mặt",
    later: "⏰ Thanh toán sau",
  };
  return methods[method] || method;
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}
