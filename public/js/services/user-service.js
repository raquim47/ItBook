import requestHandler from "../utils/requestHandler.js";

class UserService {
  // 유저 정보 수정
  async putUserInfo(userData) {
    return requestHandler('/api/user', 'PUT', userData);
  }
  // 유저 삭제 (탈퇴)
  async deleteUser(password) {
    return requestHandler('/api/user', 'DELETE', password);
  }
  // 찜한 상품 저장
  async putUserWishlist(productId){
    return requestHandler(`/api/user/wishlist/${productId}`, 'PUT');
  }
}

const userService = new UserService();
export default userService;