import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';
import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
import orderService from '../services/order-service.js';

const renderOrder = (order) => {
  console.log(order)
  return `
  <tr class="order-table__row" data-order-id="${order._id}">
    <td>
      <div class="cell-wrapper"><p>${new Date(
        order.createdAt
      ).toLocaleDateString()}</p></div>
    </td>
    <td>
      <div class="cell-wrapper">
        <h4>${order.username}</h4>
        <p>${order.email}</p>
        <p>${order.address}</p>
        <p>${order.phone}</p>
      </div>
    </td>
    <td>
      <div class="cell-wrapper">
        ${order.products
          .map(
            (product) =>
              `<a class="product-title" href="/product/${product.productId._id}"><span>${product.productId.title}</span>(${product.quantity})</a>`
          )
          .join('')}
      </div>
    </td>
    <td>
      <div class="cell-wrapper order-price">
        <p>${order.totalPrice.toLocaleString()}원</p>
      </div>
    </td>
    <td>
      <div class="cell-wrapper">
        <select class="order-status">
          <option ${
            order.status === '상품준비중' ? 'selected' : ''
          }>상품준비중</option>
          <option ${order.status === '배송중' ? 'selected' : ''}>배송중</option>
          <option ${
            order.status === '배송완료' ? 'selected' : ''
          }>배송완료</option>
          <option ${
            order.status === '주문취소' ? 'selected' : ''
          }>주문취소</option>
        </select>
      </div>
    </td>
    <td>
      <div class="cell-wrapper">
        <button class="btn delete-btn">삭제</button>
      </div>
    </td>
  </tr>
  `;
};

const updateOrderTable = (orders) => {
  const ordersAmount = document.getElementById('ordersAmount');
  ordersAmount.textContent = `(${orders.length}건)`;

  const orderTableBody = document.querySelector('.order-table tbody');

  if (orders.length === 0) {
    orderTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">
          <p class="empty">주문 내역이 없습니다.</p>
        </td>
      </tr>
    `;
  } else {
    orderTableBody.innerHTML = orders.map(renderOrder).join('');
  }
};

const filterOrdersByStatus = () => {
  
  const status = document.getElementById('orderStatusFilter').value;
  const { orders } = orderService;
  if (status === '전체') {
    updateOrderTable(orders);
    return;
  }
  const filteredOrders = orders.filter((order) => order.status === status);
  updateOrderTable(filteredOrders);
};

const handleStatusChange = async (event) => {
  const orderId = event.target.closest('.order-table__row').dataset.orderId;
  const status = event.target.value;
  const result = await orderService.putOrderStatus(orderId, { status });
  if (result.error) return;
  filterOrdersByStatus();
};

const handleDeleteOrder = async (event) => {
  if (!confirm('해당 주문 정보를 삭제하시겠습니까?')) {
    return;
  }
  const orderId = event.target.closest('.order-table__row').dataset.orderId;
  const result = await orderService.deleteOrder(orderId);
  if (result.error) return;
  const { orders } = orderService;
  updateOrderTable(orders);
};

const fetchOrders = async () => {
  const result = await orderService.getAllOrders();
  if (result.error) return;
  const { orders } = orderService;
  updateOrderTable(orders);
};

// 배송 수정/삭제 이벤트 -- 이벤트 위임, 배송상태 필터
const bindEvents = () => {
  const tableBody = document.querySelector('.order-table tbody');

  // Change 이벤트 위임
  tableBody.addEventListener('change', async (event) => {
    if (event.target.classList.contains('order-status')) {
      handleStatusChange(event);
    }
  });

  // Click 이벤트 위임
  tableBody.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
      handleDeleteOrder(event);
    }
  });

  // 배송 상태 필터
  const orderStatusFilter = document.getElementById('orderStatusFilter');
  orderStatusFilter.addEventListener('change', filterOrdersByStatus);
};

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  renderScrollTopBtn();
  bindEvents();
  fetchOrders();
};

initPage();
