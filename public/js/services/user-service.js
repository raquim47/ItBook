import buildResponse from "../utils/build-response.js";
import { ERROR } from "../utils/constants.js";

class UserService {
  async requestPutUserInfo(userData) {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        body: JSON.stringify(userData),
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
      console.error('In requestPutUserInfo', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const userService = new UserService();
export default userService;