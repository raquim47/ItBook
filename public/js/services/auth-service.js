import renderToastMessage from '../components/toast-message.js';
import { ERROR, CUSTOM_EVENT } from '../utils/constants.js';

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
    const authData = await this.requestGetAuthStatus();

    if (!authData.success) {
      renderToastMessage(authData.message, TOAST_TYPES.WANING);
    }
  }

  async requestGetAuthStatus() {
    try {
      const response = await fetch('/api/auth');
      const data = await response.json();

      if (!response.ok) {
        return data;
      }

      this._isAuth = data.isAuth;
      this._isAdmin = data.isAdmin;

      return { success: true };
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }

  async requestPostLogin(requestData) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return data;
      }

      this._isAuth = data.isAuth;
      this._isAdmin = data.isAdmin;

      // 로그인 이벤트 발행
      const event = new Event(CUSTOM_EVENT.LOGIN_SUCCESS);
      document.dispatchEvent(event);

      return { type: data.type, message: data.message };
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }

  async requestPostJoin(requestData) {
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }
}

const authService = new AuthService();
export default authService;
