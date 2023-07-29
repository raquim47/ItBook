import { ERROR, CUSTOM_EVENT } from "../utils/constants.js";

class AuthService {
  constructor() {
    this.isAuth = false;
    this.isAdmin = false;
  }

  async fetchAuthStatus() {
    try {
      const response = await fetch('/api/auth');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      this.isAuth = data.isAuth;
      this.isAdmin = data.isAdmin;
    } catch (error) {
      console.error(error.message);
    }
  }

  async requestLogin(requestData) {
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

      this.isAuth = data.isAuth;
      this.isAdmin = data.isAdmin;

      // 로그인 이벤트 발행
      const event = new Event(CUSTOM_EVENT.LOGIN_SUCCESS);
      document.dispatchEvent(event);

      return {type: data.type, message: data.message};
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }

  async requestJoin(requestData) {
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error(error);
      return ERROR.REQUEST_FAILED;
    }
  }
}

const authService = new AuthService();
export default authService;
