import { ERROR_PAGE } from '../utils/constants';

const adminRequired = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).render('error', ERROR_PAGE[403].notAdmin);
    return;
  }

  next();
};

export default adminRequired;
