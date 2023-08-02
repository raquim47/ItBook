const logoutAndRedirect = () => {
  document.cookie = `${encodeURIComponent(
    'token'
  )}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  location.href = '/';
};

export default logoutAndRedirect;