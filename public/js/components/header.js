import renderModal from './modal.js';

// 로그아웃 (쿠키삭제 후 새로고침)
const logoutAndRefresh = () => {
  document.cookie = `${encodeURIComponent(
    'token'
  )}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  location.href = '/';
};

const getCartFromServer = async () => {
  try {
      const response = await fetch('/api/cart');
      if (response.ok) {
          return await response.json();
      } 
      console.error('요청을 처리하는 도중 문제가 발생했습니다.');
      return [];
  } catch (error) {
      console.error('요청을 처리하는 도중 문제가 발생했습니다 :', error);
      return [];
  }
};

// 카트 수량 배지 업데이트
export const updateCartbadge = async () => {
  const cartBadge = document.getElementById('cartBadge');
  const isAuth = cartBadge.dataset.isAuth;
  
  const cart =
  isAuth === 'true' ? await getCartFromServer() : JSON.parse(localStorage.getItem('cart')) ?? [];
  
  cartBadge.textContent = cart.length > 0 ? cart.length : '';
  cartBadge.classList.toggle('visible', cart.length > 0);
};

// (로그인했을 때 새로고침 없이) 로그인 메뉴 업데이트
export const updateUserMenu = (authStatus) => {
  const userMenu = document.getElementById('userMenu');
  let menuItems = `
      <li>
        <a href="/cart" class="nav-user__cart-btn" aria-label="장바구니 버튼">
          <span data-is-auth="true" id="cartBadge" aria-label="장바구니 개수" class="cart-badge"></span>
        </a>
      </li>
  `;
  if (!authStatus.isAuth) {
    menuItems += `
      <li><button id="loginBtn">로그인</button></li>
      <li><button id="joinBtn">회원가입</button></li>
    `;
  } else {
    menuItems += `
      <li><a href="/mypage">마이페이지</a></li>
      ${authStatus.isAdmin ? '<li><a href="/admin">관리자페이지</a></li>' : ''}
      <li><button id="logoutBtn">로그아웃</button></li>
    `;
  }
  userMenu.innerHTML = menuItems;

  const logoutBtn = userMenu.querySelector('#logoutBtn');
  logoutBtn.addEventListener('click', logoutAndRefresh);
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

  if (loginBtn) loginBtn.addEventListener('click', () => renderModal('login'));
  if (joinBtn) joinBtn.addEventListener('click', () => renderModal('join'));
  if (logoutBtn) logoutBtn.addEventListener('click', logoutAndRefresh);

  window.addEventListener('scroll', () => toggleShadowOnScroll(header));
  
  updateCartbadge();
};

export default setupHeader;
