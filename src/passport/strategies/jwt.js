import { Strategy as JwtStrategy } from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();

const cookieExtractor = req => {
  // req 의 cookies 에서 token 사용하기
  return req.cookies.token
};

const opts = {
  secretOrKey: process.env.JWT_SECRET, 
  jwtFromRequest: cookieExtractor,
};

export default new JwtStrategy(opts, (user, done) => {
  done(null, user);
});