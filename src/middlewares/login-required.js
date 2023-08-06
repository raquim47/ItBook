import { ERROR_PAGE } from '../utils/constants';

const loginRequired = (req, res, next) => {
  if (!req.user) {
    res.status(403).render('error', ERROR_PAGE[403].notLoggedIn);
    return;
  }

  next();
}

export default loginRequired;