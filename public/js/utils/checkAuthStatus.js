const checkAuthStatus = async () => {
  try {
    const response = await fetch('/api/auth/check');
    const { authStatus } = await response.json();
    return authStatus;
  } catch (error) {
    console.error('인증 요청에 실패했습니다.', error.message);
    return { isAuth: false };
  }
};

export default checkAuthStatus;
