import showToast from '../components/toast-message.js';
import {
  ERROR,
  CUSTOM_EVENT,
  SUCCESS,
  TOAST_TYPES,
} from '../utils/constants.js';
import requestHandler from '../utils/requestHandler.js';

class AuthService {
  constructor() {
    this._isAuth = false;
    this._isAdmin = false;
  }

  get isAuth() {
    return this._isAuth;
  }

  get isAdmin() {
    return this._isAdmin;
  }

  async initializeAuth() {
    await this.getAuthStatus();
  }
  // 로그인 상태 가져오기
  async getAuthStatus() {
    const onSuccess = (data) => {
      this._isAuth = data.isAuth;
      this._isAdmin = data.isAdmin;
    };
    return await requestHandler('/api/auth', 'GET', null, onSuccess);
  }

  // 로그인
  async postLogin(requestData) {
    const onSuccess = (data) => {
      this._isAuth = data.isAuth;
      this._isAdmin = data.isAdmin;
      document.dispatchEvent(new Event(CUSTOM_EVENT.LOGIN_SUCCESS));
      showToast(SUCCESS.LOGIN, TOAST_TYPES.SUCCESS);
    };

    const onError = (error) => {
      if (error !== ERROR.PASSWORD_INVALID && error !== ERROR.EMAIL_NOT_FOUND) {
        showToast(error);
      }
    };

    return await requestHandler(
      '/api/login',
      'POST',
      requestData,
      onSuccess,
      onError
    );
  }
  
  // 회원가입
  async postJoin(requestData) {
    const onSuccess = () => {
      showToast(SUCCESS.JOIN, TOAST_TYPES.SUCCESS);
    };
    const onError = (error) => {
      if (error !== ERROR.EMAIL_DUPLICATE) {
        showToast(error);
      }
    };

    return await requestHandler(
      '/api/join',
      'POST',
      requestData,
      onSuccess,
      onError
    );
  }
}

const authService = new AuthService();
export default authService;
