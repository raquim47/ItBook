import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import getUserFromJWT from './middlewares/get-user-from-jwt';
import dotenv from 'dotenv';
import initPassport from './passport';
import indexRoutes from './routes/indexRoutes'

dotenv.config();
initPassport();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// passport/jwt
app.use(passport.initialize());
app.use(getUserFromJWT);

// views/ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.use(indexRoutes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('DB 연결');
  })
  .catch((err) => {
    console.error("Mongoose error:", err);
    process.exit(1);
  });

app.listen(process.env.PORT, () => {
  console.log(`서버 실행, 포트 : ${process.env.PORT}`);
});
