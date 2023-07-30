export const TOAST_TYPES = {
  DEFAULT: 'DEFAULT',
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
};

export const ERROR = {
  PASSWORD_INVALID: {
    type: 'PASSWORD_INVALID',
    message: '비밀번호가 올바르지 않습니다.',
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