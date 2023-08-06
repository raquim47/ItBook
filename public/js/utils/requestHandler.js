import showToast from '../components/toast-message.js';
import buildResponse from './build-response.js';
import { ERROR } from './constants.js';

const requestHandler = async (
  url,
  method = 'GET',
  data = null,
  onSuccess = null,
  onError = null
) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok || result.error) {
      if (onError) {
        onError(result.error);
      } else {
        showToast(result.error);
      }
      return buildResponse(null, result.error);
    }

    onSuccess && onSuccess(result.data);
    return buildResponse(result.data, null);
  } catch (error) {
    console.error(`Error in request for ${url}`, error);
    showToast(ERROR.REQUEST_FAILED);
    return buildResponse(null, ERROR.REQUEST_FAILED);
  }
};

export default requestHandler;
