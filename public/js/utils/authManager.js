class AuthManager {
  constructor() {
    this.isAuth = false;
    this.isAdmin = false;
    this.initAuth();
  }

  async initAuth() {
    await this.checkAuthStatus();
  }

  async checkAuthStatus() {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      this.isAuth = data.authStatus.isAuth;
      this.isAdmin = data.authStatus.isAdmin;
    } catch (error) {
      console.error('인증 상태 체크에 실패했습니다.', error);
    }
  }

  async handleLogin(requestData) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        this.isAuth = data.authStatus.isAuth;
        this.isAdmin = data.authStatus.isAdmin;
        
        // 로그인 이벤트 발행
        const event = new Event('loginSuccess');
        document.dispatchEvent(event);
        
        return { success: true, message: data.message };
      }

      return { success: false, error: data.error, message: data.message };

    } catch (error) {
      console.error(error);
      return { success: false, error: 'NETWORK_ERROR', message: '로그인 요청에 실패했습니다. 다시 시도해주세요.' };
    }
  }
  
  async handleJoin(requestData) {
    try {
      const response = await fetch('/api/auth/join', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      }

      return { success: false, error: data.error, message: data.message };

    } catch (error) {
      console.error(error);
      return { success: false, error: 'NETWORK_ERROR', message: '회원가입 요청에 실패했습니다. 다시 시도해주세요.' };
    }
  }
}

const authManager = new AuthManager();
export default authManager;
