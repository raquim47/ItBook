import renderModal from './modal.js';

// 로그아웃 (쿠키삭제 후 새로고침)
const logoutAndRefresh = () => {
  document.cookie = `${encodeURIComponent(
    'token'
  )}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  location.href = '/';
};

// 스크롤 시 헤더 그림자 효과
const toggleShadowOnScroll = (target) => {
  const windowScroll = window.pageYOffset || document.documentElement.scrollTop;

  target.classList.toggle('shadow', target.offsetTop < windowScroll);
};

// 로그인 메뉴 업데이트
export const updateAuthMenu = (authStatus) => {
  const navUserList = header.querySelector('#authMenu');
  let menuItems = '';
  if (!authStatus.isAuth) {
    menuItems = `
      <button id="loginBtn">로그인</button>
      <button id="joinBtn">회원가입</button>
    `;
  } else {
    menuItems = `
      <a href="/mypage">마이페이지</a>
      ${authStatus.isAdmin ? '<a href="/admin">관리자페이지</a>' : ''}
      <button id="logoutBtn">로그아웃</button>
    `;
  }
  navUserList.innerHTML = menuItems;

  const loginBtn = navUserList.querySelector('#loginBtn');
  const joinBtn = navUserList.querySelector('#joinBtn');
  const logoutBtn = navUserList.querySelector('#logoutBtn');

  if (loginBtn) loginBtn.addEventListener('click', () => renderModal('login'));
  if (joinBtn) joinBtn.addEventListener('click', () => renderModal('join'));
  if (logoutBtn) logoutBtn.addEventListener('click', logoutAndRefresh);
};

const setupHeader = (authStatus) => {
  const header = document.getElementById('header');
  updateAuthMenu(authStatus);

  window.addEventListener('scroll', () => toggleShadowOnScroll(header));
};

export default setupHeader;
