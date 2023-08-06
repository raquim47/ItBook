import { ERROR } from './constants';
import buildResponse from './build-response';

export const asyncApiHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.error(ERROR.INTERNAL_ERROR, err.message);
    res.status(500).json(buildResponse(null, ERROR.INTERNAL_ERROR));
  }
};

export const asyncRenderHandler =
  (fn, errorPage = 'error.ejs') =>
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error(ERROR.INTERNAL_ERROR, err.message);
      res.status(500).render(errorPage, ERROR.INTERNAL_ERROR);
    }
  };
