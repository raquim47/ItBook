import showToast from '../components/toast-message.js';
import { ERROR } from './constants.js';

const requestHandler = async (url, method = 'GET', data = null) => {
  const options = {
    method: method,
    ...(data && {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
      showToast(result.error); // Automatically show toast on error
      return null;
    }
    return result.data;
  } catch (error) {
    console.error(`In fetchRequest for ${url}`, error);
    showToast(ERROR.REQUEST_FAILED);
    return null;
  }
};

export default requestHandler;
