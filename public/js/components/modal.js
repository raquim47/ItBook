import authService from '../services/auth-service.js';
import { ERROR, SUCCESS, TOAST_TYPES, MODAL_MODE } from '../utils/constants.js';
import renderToastMessage from './toast-message.js';

// 모달 닫기
const closeModal = () => {
  const modal = document.querySelector('.modal');
  modal.classList.remove('show');

  setTimeout(() => {
    modal.remove();
  }, 250);
};

// 유효성 검사 에러 메세지
const showErrorMessage = (field, message) => {
  const errorElement = document.querySelector(`#${field}Error`);
  errorElement.textContent = message;
  errorElement.parentElement.classList.add('error');
  errorElement.classList.add('shake');
  errorElement.addEventListener('animationend', () => {
    errorElement.classList.remove('shake');
  });
};

// 로그인 요청
const handleRequestLogin = async (requestData) => {
  const result = await authService.requestLogin(requestData);

  switch (result.type) {
    case SUCCESS.LOGIN.type:
      closeModal();
      setTimeout(() => {
        renderToastMessage(result.message, TOAST_TYPES.SUCCESS);
      }, 250);
      break;
    case ERROR.EMAIL_NOT_FOUND.type:
      showErrorMessage('email', result.message);
      break;
    case ERROR.PASSWORD_INVALID.type:
      showErrorMessage('password', result.message);
      break;
    default:
      renderToastMessage(result.message, TOAST_TYPES.WARNING);
  }
};

// 회원 가입 요청
const handleRequestJoin = async (requestData) => {
  const result = await authService.requestJoin(requestData);

  switch (result.type) {
    case SUCCESS.JOIN.type:
      closeModal();
      setTimeout(() => {
        renderToastMessage(result.message, TOAST_TYPES.SUCCESS);
      }, 250);
      break;
    case ERROR.EMAIL_DUPLICATE.type:
      showErrorMessage('email', result.message);
      break;
    default:
      renderToastMessage(result.message, TOAST_TYPES.WARNING);
  }
};


const validationRules = {
  email: {
    test: value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value),
    message: '유효한 이메일(영문, 숫자)을 입력해주세요.',
    required: '이메일을 입력해주세요.',
  },
  password: {
    test: value => value.length >= 6,
    message: '비밀번호는 6자 이상이어야 합니다.',
    required: '비밀번호를 입력해주세요.',
  },
  username: {
    test: value => /^[\uAC00-\uD7A3]+$/.test(value),
    message: '한글로 이름을 입력해주세요.',
    required: '이름을 입력해주세요.',
  },
  passwordConfirm: {
    test: (value, allValues) => value === allValues.password,
    message: '비밀번호가 일치하지 않습니다.',
    required: '비밀번호 확인을 입력해주세요.',
  },
};

// 클라이언트 사이드 폼 유효성 검사
const validateForm = (isJoinMode, data) => {
  const fieldsToValidate = isJoinMode ? ['email', 'password', 'username', 'passwordConfirm'] : ['email', 'password'];
  const errors = {};

  for (const field of fieldsToValidate) {
    const value = data[field] || "";
    const rule = validationRules[field];

    if (!value.trim()) {
      errors[field] = rule.required;
    } else if (!rule.test(value, data)) {
      errors[field] = rule.message;
    }
  }

  if (Object.keys(errors).length > 0) {
    // 에러 메시지를 한꺼번에 보여줌
    for (const field of fieldsToValidate) {
      if (errors[field]) {
        showErrorMessage(field, errors[field]);
      }
    }
    return false;
  }

  return true;
};

// 모달 폼 제출 이벤트
const onSubmitForm = async (e, isJoinMode) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const parsedFormData = Object.fromEntries(formData);

  if (!validateForm(isJoinMode, parsedFormData)) return;


  if (isJoinMode) {
    await handleRequestJoin(parsedFormData);
  } else {
    await handleRequestLogin(parsedFormData);
  }
};

// 폼 에러 메세지 초기화
const resetErrorMessage = (e) => {
  const inputElement = e.target;
  const parentFormItem = inputElement.closest('.modal-form__item');
  const errorElement = parentFormItem.querySelector('.modal-form__error');
  errorElement.textContent = '';
  parentFormItem.classList.remove('error');
};

// 모달 내부 템플릿(로그인/회원가입) 생성
const createModalTemplate = (isJoinMode) => {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
  <div class="modal__backdrop"></div>
  <div class="modal__content">
    <div class="modal__close">
      <button class="x-btn" aria-label="모달 닫기"></button>
    </div>
    <form class="modal-form">
      <h3 class="modal-form__title">${isJoinMode ? '회원가입' : '로그인'}</h3>
      <ul class="modal-form__list">
        <li class="modal-form__item">
          <input type="text" name="email" id="emailInput" placeholder=" " autocomplete="email"/>
          <label for="emailInput">이메일</label>
          <span class="modal-form__error" aria-label="에러 메시지" id="emailError"></span>
        </li>
        ${
          isJoinMode
            ? `<li class="modal-form__item">
          <input type="text" name="username" id="usernameInput" placeholder=" " autocomplete="username"/>
          <label for="usernameInput">이름</label>
          <span class="modal-form__error" aria-label="에러 메시지" id="usernameError"></span>
        </li>`
            : ''
        }
        <li class="modal-form__item">
          <input type="password" name="password" id="passwordInput" placeholder=" " autocomplete="new-password"/>
          <label for="passwordInput">비밀번호</label>
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
  return modal;
};

// 모달 컨테이너 생성/열기
const renderModal = (mode) => {
  const isJoinMode = mode === MODAL_MODE.JOIN;

  const modal = createModalTemplate(isJoinMode);
  // 모달 닫기 이벤트
  const backdrop = modal.querySelector('.modal__backdrop');
  const closeBtn = modal.querySelector('.modal__close button');
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  // 모달 폼 이벤트
  const form = modal.querySelector('.modal-form');
  form.addEventListener('submit', (e) => onSubmitForm(e, isJoinMode));
  form.addEventListener('input', resetErrorMessage);

  // 모달 나타내기
  document.body.prepend(modal);
  setTimeout(() => modal.classList.add('show'), 50);
};

export default renderModal;
