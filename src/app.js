import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import getUserFromJWT from './middlewares/get-user-from-jwt';
import dotenv from 'dotenv';
// import viewsRoutes from './routes/views.js';
// import productRoutes from './routes/product.js';
// import userRoutes from './routes/user.js';
// import authRoutes from './routes/auth';
// import categoryRoutes from './routes/category';
// import orderRoutes from './routes/order';
import initPassport from './passport';
import publicRoutes from './routes/public'

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

app.use(publicRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', {
      pageTitle: '404 - 페이지를 찾을 수 없습니다',
  });
});

// Error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
