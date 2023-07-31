import renderToastMessage from '../components/toast-message.js';
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
    const result = await this.requestGetAuthStatus();

    if (result.error) {
      renderToastMessage(result.error.message, TOAST_TYPES.WANING);
    }
  }

  async requestGetAuthStatus() {
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
      console.error('In requestGetAuthStatus', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
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

      const result = await response.json();

      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      this._isAuth = result.data.isAuth;
      this._isAdmin = result.data.isAdmin;

      document.dispatchEvent(new Event(CUSTOM_EVENT.LOGIN_SUCCESS));
      return buildResponse();
    } catch (error) {
      console.error('In requestPostLogin', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
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
      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse();
    } catch (error) {
      console.error('In requestPostJoin', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const authService = new AuthService();
export default authService;
