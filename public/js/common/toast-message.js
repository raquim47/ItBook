import { TOAST_TYPES } from "../utils/constants.js";

const renderToastMessage = (content, type = TOAST_TYPES.DEFAULT) => {
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) return;

  const toastMessage = document.createElement('div');
  toastMessage.className = `toast-message toast-message--${type.toLowerCase()}`;
  toastMessage.innerHTML = content;
  document.body.prepend(toastMessage);

  setTimeout(() => {
    toastMessage.classList.add('show');
  }, 10);

  setTimeout(() => {
    toastMessage.classList.remove('show');

    setTimeout(() => {
      toastMessage.remove();
    }, 250);
  }, 3000);
};

export default renderToastMessage;
