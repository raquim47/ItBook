export const TOAST_TYPES = {
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
};

export const SUCCESS = {
  LOGIN: '로그인에 성공했습니다.',
  JOIN: '회원가입이 완료되었습니다.',
  EDIT_USER: '회원 정보가 변경되었습니다.',
  ORDER: '주문이 완료되었습니다.',
  CANCLE_ORDER: '주문이 취소되었습니다.',
  PRODUCT_POSTED: '상품이 등록되었습니다.',
  PRODUCT_UPDATED: '상품 내용이 수정되었습니다.',
  PRODUCT_DELETED: '상품이 삭제되었습니다.',
  ORDER_STATUS_UPDATED: '주문 상태가 수정되었습니다.',
  ORDER_DELETED: '주문이 삭제되었습니다.',
};

export const ERROR = {
  AUTH_REQUIRED: '로그인이 필요합니다',
  USERNAME_INVALID: '한글로 이름을 입력해주세요.',
  USERNAME_REQUIRED: '이름은 필수 입력사항입니다.',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  PASSWORD_INVALID: '비밀번호가 올바르지 않습니다.',
  ORDER_ITEMS_REQUIRED: '선택된 주문 상품이 없습니다.',
  ORDER_NOT_FOUND: '해당 주문을 찾을 수 없습니다.',
  EMAIL_NOT_FOUND: '등록되지 않은 이메일입니다.',
  EMAIL_DUPLICATE: '이미 등록된 이메일입니다.',
  CATEGORY_REQUIRED: '소분류 카테고리가 선택되지 않았습니다.',
  PHONE_INVALID: '전화번호 양식이 올바르지 않습니다.',
  ADDREDD_PHONE_REQUIRED: '배송지와 전화번호를 모두 입력해주세요.',
  PRODUCT_NOT_FOUND: '등록되지 않은 상품입니다.',
  AGREEMENT_REQUIRED: '동의 사항에 체크해주세요',
  INTERNAL_ERROR: '서버 오류가 발생했습니다.',
  REQUEST_FAILED: '요청에 실패했습니다.',
  ADMIN_DELETE_NOT_ALLOWED: '관리자 계정은 삭제할 수 없습니다.',
};

export const MODAL_MODE = {
  JOIN: 'JOIN',
  LOGIN: 'LOGIN',
};

export const CUSTOM_EVENT = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  CART_UPDATED: 'CART_UPDATED',
};

export const DELIVERY = {
  FEE: 3000,
  FREE_THRESHOLD: 50000,
};

export const LOCAL_STORAGE_KEYS = {
  ORDER_ITEMS: 'orderItems',
  CART_ITEMS: 'cartItems',
};

export const ERROR_PAGE = {
  404: {
    message: '페이지를 찾을 수 없습니다.',
    pageTitle: '404 ERROR - 잇북',
  },
};

export const CLASSNAME = {
  HIDDEN: 'hidden',
};
