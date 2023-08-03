import buildResponse from "../utils/build-response.js";
import { ERROR } from "../utils/constants.js";

class UserService {
  async putUserInfo(userData) {
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
      console.error('In putUserInfo', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async deleteUser(password) {
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
        body: JSON.stringify({ password: password }),
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
      console.error('In deleteUser', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }

  async putUserWishlist(productId){
    try {
      const response = await fetch(`/api/user/wishlist/${productId}`, {
        method: 'PUT',
      });
      
      const result = await response.json();
      if (!response.ok) {
        return buildResponse(null, result.error);
      }

      return buildResponse();
    } catch (error) {
      console.error('In putUserWishlist', error);
      return buildResponse(null, ERROR.REQUEST_FAILED);
    }
  }
}

const userService = new UserService();
export default userService;