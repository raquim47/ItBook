const createModalTemplate = (mode) => {
  const isJoinMode = mode === 'join';
  return `
  <div class="modal__backdrop"></div>
  <div class="modal__content">
    <button class="modal__closeBtn" aria-label="모달 닫기"></button>
    <form class="modal-form">
      <h3 class="modal-form__title">${isJoinMode ? '회원가입' : '로그인'}</h3>
      <ul class="modal-form__list">
        <li class="modal-form__item">
          <input type="text" name="email" id="emailInput" placeholder=" "/>
          <label for="emailInput">이메일</label>
          <span class="modal-form__error" aria-label="에러 메시지">에러메시지</span>
        </li>
        ${
          isJoinMode
            ? `<li class="modal-form__item">
          <input type="text" name="username" id="usernameInput" placeholder=" "/>
          <label for="usernameInput">이름</label>
          <span class="modal-form__error" aria-label="에러 메시지"></span>
        </li>`
            : ''
        }
        <li class="modal-form__item">
          <input type="password" name="password" id="passwordInput" placeholder=" "/>
          <label for="usernameInput">비밀번호</label>
          <span class="modal-form__error" aria-label="에러 메시지"></span>
        </li>
        ${
          isJoinMode
            ? `<li class="modal-form__item">
          <input type="password" name="username" id="passwordConfirmInput" placeholder=" "/>
          <label for="passwordConfirmInput">비밀번호 확인</label>
          <span class="modal-form__error" aria-label="에러 메시지"></span>
        </li>`
            : ''
        }
      </ul>
      ${
        isJoinMode
          ? `<button id="joinSubmitBtn" class="modal-form__submit-btn">회원가입</button>`
          : `<button id="loginSubmitBtn" class="modal-form__submit-btn">로그인</button>`
      }
    </form>
  </div>
`;
};

// 모달 닫기
const bindModalCloseEvent = (modal) => {
  // backdrop 클릭 시 모달 제거
  modal.querySelector('.modal__backdrop').addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 250);
  });

  // 닫기 버튼 클릭 시 모달 제거
  modal.querySelector('.modal__closeBtn').addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 250);
  });
};

// 모달 레이아웃 생성/열기
const openModal = (mode) => {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = createModalTemplate(mode);

  bindModalCloseEvent(modal);

  document.body.prepend(modal);
  setTimeout(() => modal.classList.add('show'), 50);
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
  loginBtn.addEventListener('click', () => openModal('login'));
  joinBtn.addEventListener('click', () => openModal('join'));

  window.addEventListener('scroll', () => toggleShadowOnScroll(header));
};

export default setupHeader;
