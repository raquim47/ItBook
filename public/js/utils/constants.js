export const TOAST_TYPES = {
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
};

export const SUCCESS = {
  LOGIN: {
    type: 'LOGIN_SUCCESS',
    message: '로그인에 성공했습니다.',
  },
  JOIN: {
    type: 'JOIN_SUCCESS',
    message: '회원가입이 완료되었습니다.',
  },
  ORDER: {
    type: 'ORDER_SUCCESS',
    message: '주문이 완료되었습니다.',
  },
};

export const ERROR = {
  AUTH_REQUIRED: {
    type: 'AUTH_REQUIRED',
    message: '로그인이 필요합니다',
  },
  
  AGREEMENT_REQUIRED: {
    type: 'AGREEMENT_REQUIRED',
    message: '동의 사항에 체크해주세요',
  },

  ORDER_ITEMS_REQUIRED: {
    type: 'ORDER_ITEMS_REQUIRED',
    message: '선택된 주문 상품이 없습니다.',
  },

  PASSWORD_INVALID: {
    type: 'PASSWORD_INVALID',
    message: '비밀번호가 올바르지 않습니다.',
  },
  
  PHONE_INVALID: {
    type: 'PHONE_INVALID',
    message: '전화번호 양식이 올바르지 않습니다.',
  },

  ADDREDD_PHONE_REQUIRED: {
    type: 'ADDREDD_PHONE_REQUIRED',
    message: '배송지와 전화번호를 모두 입력해주세요.',
  },

  EMAIL_NOT_FOUND: {
    type: 'EMAIL_NOT_FOUND',
    message: '등록되지 않은 이메일입니다.',
  },

  EMAIL_DUPLICATE: {
    type: 'EMAIL_DUPLICATE',
    message: '이미 등록된 이메일입니다.',
  },

  PRODUCT_NOT_FOUND : {
    type: 'PRODUCT_NOT_FOUND',
    message : '등록되지 않은 상품입니다.'
  },

  INTERNAL_ERROR: {
    type: 'LOGIN_FAILED',
    message: '서버 오류가 발생했습니다.',
  },

  REQUEST_FAILED: {
    type: 'REQUEST_FAILED',
    message: '요청에 실패했습니다.',
  },
};

export const MODAL_MODE = {
  JOIN: 'JOIN',
  LOGIN: 'LOGIN',
};

export const CUSTOM_EVENT = {
  LOGIN_SUCCESS : 'LOGIN_SUCCESS',
  CART_UPDATED : 'CART_UPDATED'
}

export const DELIVERY = {
  FEE: 3000,
  FREE_THRESHOLD: 50000,
};

export const LOCAL_STORAGE_KEYS = {
  ORDER_ITEMS: 'orderItems',
  CART_ITEMS: 'cartItems',
};