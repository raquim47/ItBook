import { TOAST_TYPES } from '../utils/constants.js';
import renderToastMessage from './toast-message.js';
import { updateUserMenu, updateCartbadge } from './header.js';

const mergeLocalCartWithServer = async () => {
  const localCartItems = JSON.parse(localStorage.getItem('cart')) || [];

  if (localCartItems.length === 0) return;

  try {
    const response = await fetch('/api/cart/merge', {
      method: 'POST',
      body: JSON.stringify(localCartItems),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const { message } = await response.json();
      renderToastMessage(message, TOAST_TYPES.WARNING);
    }

    // 로컬스토리지의 장바구니 아이템 제거
    localStorage.removeItem('cart');
  } catch (error) {
    console.error(error);
    renderToastMessage(
      '요청을 처리하는 도중 문제가 발생했습니다.',
      TOAST_TYPES.WARNING
    );
  }
};

// 로그인 요청
const submitLoginRequest = async (requestData) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { error, message, authStatus } = await response.json();
    if (response.ok) {
      const modal = document.querySelector('.modal');
      modal.classList.remove('show');

      setTimeout(() => {
        modal.remove();
        renderToastMessage(message, TOAST_TYPES.SUCCESS);
      }, 250);

      updateUserMenu(authStatus);

      // 상세페이지 장바구니버튼
      const isProductPage = location.pathname.startsWith('/product/');
      if (isProductPage) {
        const cartBtns = document.querySelectorAll(
          'product-detail__btns button'
        );
        cartBtns.forEach((btn) => {
          btn.dataset.isAuth = 'true';
        });
      }
      const cartList = document.getElementById('cartList');
      cartList.dataset.isAuth = 'true';

      await mergeLocalCartWithServer();
      await updateCartbadge();
      return;
    }

    if (error === 'EMAIL_NOT_FOUND') {
      const emailErrorElement = document.querySelector('#emailError');
      emailErrorElement.textContent = message;
      emailErrorElement.parentElement.classList.add('error');
    } else if (error === 'INVALID_PASSWORD') {
      const passwordErrorElement = document.querySelector('#passwordError');
      passwordErrorElement.textContent = message;
      passwordErrorElement.parentElement.classList.add('error');
    } else {
      renderToastMessage(message, TOAST_TYPES.WARNING);
    }
  } catch (error) {
    console.error(error);
    renderToastMessage(
      '로그인 요청에 실패했습니다. 다시 시도해주세요.',
      TOAST_TYPES.WARNING
    );
  }
};

// 회원 가입 요청
const submitJoinRequest = async (requestData) => {
  try {
    const response = await fetch('/api/auth/join', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { error, message } = await response.json();

    if (response.ok) {
      const modal = document.querySelector('.modal');
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
        renderToastMessage(message, TOAST_TYPES.SUCCESS);
      }, 250);
      return;
    }

    if (error === 'DUPLICATE_EMAIL') {
      const emailErrorElement = document.querySelector('#emailError');
      emailErrorElement.textContent = message;
      emailErrorElement.parentElement.classList.add('error');
    } else {
      renderToastMessage(message, TOAST_TYPES.WARNING);
    }
  } catch (error) {
    console.error(error);
    renderToastMessage(
      '요청에 실패했습니다. 다시 시도해주세요.',
      TOAST_TYPES.WARNING
    );
  }
};

// 유효성 검사 에러 동작 실행
const setError = (field, message) => {
  const errorElement = document.querySelector(`#${field}Error`);
  errorElement.textContent = message;
  errorElement.parentElement.classList.add('error');
  errorElement.classList.add('shake');
  errorElement.addEventListener('animationend', () => {
    errorElement.classList.remove('shake');
  });
};

// 클라이언트 사이드 유효성 검사
const validateForm = (mode, form) => {
  const formData = new FormData(form);

  const fieldsToValidate = ['email', 'password'];
  if (mode === 'join') {
    fieldsToValidate.push('username', 'passwordConfirm');
  }

  let isValid = true;
  fieldsToValidate.forEach((field) => {
    const value = formData.get(field);

    if (!value.trim()) {
      const fieldMap = {
        email: '이메일을',
        password: '비밀번호를',
        username: '이름을',
        passwordConfirm: '비밀번호 확인을',
      };
      setError(field, `${fieldMap[field]} 입력해주세요.`);
      isValid = false;
    } else if (
      field === 'email' &&
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
    ) {
      setError(field, '유효한 이메일(영문, 숫자)을 입력해주세요.');
      isValid = false;
    } else if (field === 'username' && !/^[\uAC00-\uD7A3]+$/.test(value)) {
      setError(field, '한글로만 이름을 입력해주세요.');
      isValid = false;
    } else if (field === 'password' && value.length < 6) {
      setError(field, '비밀번호는 6자 이상이어야 합니다.');
      isValid = false;
    } else if (
      field === 'passwordConfirm' &&
      value !== formData.get('password')
    ) {
      setError(field, '비밀번호가 일치하지 않습니다.');
      isValid = false;
    } else {
      const errorElement = form.querySelector(`#${field}Error`);
      errorElement.textContent = '';
    }
  });

  return isValid;
};

// 모달 이벤트 바인딩 - 모달 닫기
const bindModalCloseEvent = (modal) => {
  const closeModal = () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 250);
  };

  modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
  modal
    .querySelector('.modal__close button')
    .addEventListener('click', closeModal);
};

// 모달 이벤트 바인딩
const bindModalEvents = (modal, mode) => {
  bindModalCloseEvent(modal);

  const form = modal.querySelector('.modal-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(mode, form)) return;

    const formData = new FormData(form);
    const parsedFormData = Object.fromEntries(formData);
    if (mode === 'join') {
      await submitJoinRequest(parsedFormData);
    } else {
      await submitLoginRequest(parsedFormData);
    }
  });

  form.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
      const errorElement = e.target.nextElementSibling.nextElementSibling;
      errorElement.textContent = '';
      e.target.closest('.modal-form__item').classList.remove('error');
    }
  });
};
// 모달 내부 템플릿(로그인/회원가입) 생성
const createModalTemplate = (mode) => {
  const isJoinMode = mode === 'join';
  return `
  <div class="modal__backdrop"></div>
  <div class="modal__content">
    <div class="modal__close">
      <button class="x-btn" aria-label="모달 닫기"></button>
    </div>
    <form class="modal-form">
      <h3 class="modal-form__title">${isJoinMode ? '회원가입' : '로그인'}</h3>
      <ul class="modal-form__list">
        <li class="modal-form__item">
          <input type="text" name="email" id="emailInput" placeholder=" "/>
          <label for="emailInput">이메일</label>
          <span class="modal-form__error" aria-label="에러 메시지" id="emailError"></span>
        </li>
        ${
          isJoinMode
            ? `<li class="modal-form__item">
          <input type="text" name="username" id="usernameInput" placeholder=" "/>
          <label for="usernameInput">이름</label>
          <span class="modal-form__error" aria-label="에러 메시지" id="usernameError"></span>
        </li>`
            : ''
        }
        <li class="modal-form__item">
          <input type="password" name="password" id="passwordInput" placeholder=" " autocomplete="new-password"/>
          <label for="usernameInput">비밀번호</label>
          <span class="modal-form__error" aria-label="에러 메시지" id="passwordError"></span>
        </li>
        ${
          isJoinMode
            ? `<li class="modal-form__item">
          <input type="password" name="passwordConfirm" id="passwordConfirmInput" placeholder=" " autocomplete="new-password"/>
          <label for="passwordConfirmInput">비밀번호 확인</label>
          <span class="modal-form__error" aria-label="에러 메시지" id="passwordConfirmError"></span>
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

// 모달 컨테이너 생성/열기
const renderModal = (mode) => {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = createModalTemplate(mode);

  bindModalEvents(modal, mode);
  bindModalCloseEvent(modal);

  document.body.prepend(modal);
  setTimeout(() => modal.classList.add('show'), 50);
};

export default renderModal;
