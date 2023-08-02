import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';
import renderToastMessage from '../components/toast-message.js';
import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
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
    renderToastMessage(ERROR.USERNAME_REQUIRED.message);
    return false;
  }

  if (!koreanRegex.test(username)) {
    renderToastMessage(ERROR.USERNAME_INVALID.message);
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
        renderToastMessage(result.error.message);
      } else {
        document.getElementById('usernameTitle').textContent =
          formData.username;
        renderToastMessage(SUCCESS.EDIT_USER.message, TOAST_TYPES.SUCCESS);
      }
    });
};

const initMyPage = () => {};

const initEditPage = () => {
  bindAddressSearch();
  bindSaveUser();
};

const initOrderPage = () => {};

const initResignPage = () => {
  document
    .getElementById('resignForm')
    .addEventListener('submit', async (e) => {
      e.preventDefault();

      const password = document.getElementById('resignPassword').value;
      if (!password) {
        renderToastMessage(ERROR.PASSWORD_REQUIRED.message);
        return;
      }

      const isConfirmed = confirm('정말로 회원 탈퇴를 진행하시겠습니까?');
      if (!isConfirmed) return;
      const result = await userService.requestDeleteUser(password);
      if (result.error) {
        renderToastMessage(result.error.message);
      } else {
        logoutAndRedirect();
        location.href = '/'
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
