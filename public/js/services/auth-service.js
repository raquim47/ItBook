import showToast from '../components/toast-message.js';
import buildResponse from '../utils/build-response.js';
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
    const result = await this.getAuthStatus();

    if (result.error) {
      showToast(result.error);
    }
  }

  async getAuthStatus() {
    try {
      const response = await fetch('/api/auth');
      const result = await response.json();

      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      this._isAuth = result.data.isAuth;
      this._isAdmin = result.data.isAuth;

      return buildResponse();
    } catch (error) {
      console.error('In getAuthStatus', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async postLogin(requestData) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      this._isAuth = result.data.isAuth;
      this._isAdmin = result.data.isAdmin;

      document.dispatchEvent(new Event(CUSTOM_EVENT.LOGIN_SUCCESS));
      return buildResponse();
    } catch (error) {
      console.error('In postLogin', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async postJoin(requestData) {
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse();
    } catch (error) {
      console.error('In postJoin', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const authService = new AuthService();
export default authService;
