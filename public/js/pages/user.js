import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';
import renderToastMessage from '../components/toast-message.js';
import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
import orderService from '../services/order-service.js';
import userService from '../services/user-service.js';
import bindAddressSearch from '../utils/bindAddressSearch.js';
import { ERROR, SUCCESS, TOAST_TYPES } from '../utils/constants.js';
import logoutAndRedirect from '../utils/logoutAndRedirect.js';

const validateForm = () => {
  const username = document.getElementById('username').value;
  const phone = document.getElementById('phone').value;

  const koreanRegex = /^[가-힣]+$/;
  const phoneRegex = /^010-(\d{4})-(\d{4})$/;

  if (!username) {
    renderToastMessage(ERROR.USERNAME_REQUIRED);
    return false;
  }

  if (!koreanRegex.test(username)) {
    renderToastMessage(ERROR.USERNAME_INVALID);
    return false;
  }

  if (phone && !phoneRegex.test(phone)) {
    renderToastMessage(ERROR.PHONE_INVALID.message);
    return false;
  }

  return true;
};

const bindSaveUser = () => {
  document
    .querySelector('.user-form__save-btn')
    .addEventListener('click', async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }

      const formData = {
        username: document.getElementById('username').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
      };

      const result = await userService.requestPutUserInfo(formData);
      if (result.error) {
        renderToastMessage(result.error);
      } else {
        document.getElementById('usernameTitle').textContent =
          formData.username;
        renderToastMessage(SUCCESS.EDIT_USER, TOAST_TYPES.SUCCESS);
      }
    });
};

const initMyPage = () => {};

const initEditPage = () => {
  bindAddressSearch();
  bindSaveUser();
};

const cancelOrder = async (orderId) => {
  const result = await orderService.requestPutCancelOrder(orderId);
  if (result.error) {
    renderToastMessage(result.error);
  } else {
    renderToastMessage(SUCCESS.CANCLE_ORDER, TOAST_TYPES.SUCCESS);
    // 성공적으로 주문 취소 요청을 처리한 후 UI 갱신
    const updatedOrder = result.data;
    const orderItemElement = document.querySelector(
      `.order__item[data-order-id="${orderId}"]`
    );

    // 주문 상태 업데이트
    const statusElement = orderItemElement.querySelector('td:nth-child(4)');
    statusElement.innerHTML = `
    ${updatedOrder.deliveryStatus}
    ${
      updatedOrder.deliveryStatus === '상품 준비중'
        ? '<button class="order__cancel-btn">배송취소</button>'
        : '<button class="order__cancel-btn" disabled>배송취소</button>'
    }
  `;
  }
};

const initOrderPage = async () => {
  const result = await orderService.requestGetMyOrder();
  if (result.error) {
    renderToastMessage(result.error);
    return;
  }
  const orderTableBody = document.querySelector('.order__table tbody');
  const orders = result.data;

  if (orders.length === 0) {
    orderTableBody.innerHTML =
      '<tr><td colspan="4" class="empty">주문 내역이 없습니다.</td></tr>';
    return;
  }

  orderTableBody.innerHTML = orders
    .map(
      (order) => `
      <tr class="order__item" data-order-id="${order._id}">
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>
          ${order.products
            .map(
              (product) => `
            <div class="order__product">
              ${product.productId.title} (${product.quantity})
            </div>
          `
            )
            .join('')}
        </td>
        <td>${order.totalPrice.toLocaleString()}원</td>
        <td>
          ${order.deliveryStatus}
          ${
            order.deliveryStatus === '상품 준비중'
              ? '<button class="order__cancel-btn">배송취소</button>'
              : '<button class="order__cancel-btn" disabled>배송취소</button>'
          }
        </td>
      </tr>
    `
    )
    .join('');

  orderTableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('order__cancel-btn')) {
      const isConfirmed = confirm('주문을 취소하시겠습니까?');
      if (!isConfirmed) return;
      const orderId = event.target.closest('.order__item').dataset.orderId;
      cancelOrder(orderId);
    }
  });
};

const initResignPage = () => {
  document
    .getElementById('resignForm')
    .addEventListener('submit', async (e) => {
      e.preventDefault();

      const password = document.getElementById('resignPassword').value;
      if (!password) {
        renderToastMessage(ERROR.PASSWORD_REQUIRED);
        return;
      }

      const isConfirmed = confirm('정말로 회원 탈퇴를 진행하시겠습니까?');
      if (!isConfirmed) return;
      const result = await userService.requestDeleteUser(password);
      if (result.error) {
        renderToastMessage(result.error);
      } else {
        logoutAndRedirect();
        location.href = '/';
      }
    });
};

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  renderScrollTopBtn();

  const path = window.location.pathname;
  if (path === '/user' || path === '/user/mypage') {
    initMyPage();
  } else if (path === '/user/edit') {
    initEditPage();
  } else if (path === '/user/order') {
    initOrderPage();
  } else if (path === '/user/resign') {
    initResignPage();
  }
};

initPage();
