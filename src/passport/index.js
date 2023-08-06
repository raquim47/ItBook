import passport from 'passport';
import jwt from './strategies/jwt';

export default () => {
  passport.use(jwt);
};
