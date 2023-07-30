import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
import { CUSTOM_EVENT, MODAL_MODE } from '../utils/constants.js';
import renderModal from './modal.js';

// 로그아웃 (쿠키삭제 후 새로고침)
const logoutAndRedirect = () => {
  document.cookie = `${encodeURIComponent(
    'token'
  )}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  location.href = '/';
};

// 카트 수량 배지 업데이트
const updateCartbadge = async () => {
  const cart = cartService.cart;
  
  const cartBadge = document.getElementById('cartBadge');
  cartBadge.textContent = cart.length > 0 ? cart.length : '';
  cartBadge.classList.toggle('visible', cart.length > 0);
};

// (로그인했을 때 새로고침 없이) 로그인 메뉴 업데이트
const updateUserMenu = async () => {
  const userMenu = document.getElementById('userMenu');
  let menuItems = `
      <li>
        <a href="/cart" class="nav-user__cart-btn" aria-label="장바구니 버튼">
          <span data-is-auth="true" id="cartBadge" aria-label="장바구니 개수" class="cart-badge"></span>
        </a>
      </li>
      <li><a href="/mypage">마이페이지</a></li>
      ${authService.isAdmin ? '<li><a href="/admin">관리자페이지</a></li>' : ''}
      <li><button id="logoutBtn">로그아웃</button></li>
  `;
  userMenu.innerHTML = menuItems;

  const logoutBtn = userMenu.querySelector('#logoutBtn');
  logoutBtn.addEventListener('click', logoutAndRedirect);
};

// 스크롤 시 헤더 그림자 효과
const toggleShadowOnScroll = (target) => {
  const windowScroll = window.pageYOffset || document.documentElement.scrollTop;

  target.classList.toggle('shadow', target.offsetTop < windowScroll);
};

const setupHeader = () => {
  const header = document.getElementById('header');

  const loginBtn = header.querySelector('#loginBtn');
  const joinBtn = header.querySelector('#joinBtn');
  const logoutBtn = header.querySelector('#logoutBtn');
  
  if (loginBtn) loginBtn.addEventListener('click', () => renderModal(MODAL_MODE.LOGIN));
  if (joinBtn) joinBtn.addEventListener('click', () => renderModal(MODAL_MODE.JOIN));
  if (logoutBtn) logoutBtn.addEventListener('click', logoutAndRedirect);

  window.addEventListener('scroll', () => toggleShadowOnScroll(header));
  
  document.addEventListener(CUSTOM_EVENT.LOGIN_SUCCESS, updateUserMenu)
  document.addEventListener(CUSTOM_EVENT.LOGIN_SUCCESS, updateCartbadge)
  document.addEventListener(CUSTOM_EVENT.CART_UPDATED, updateCartbadge)
};

export default setupHeader;
