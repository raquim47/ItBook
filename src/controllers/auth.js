import setUserToken from '../utils/set-user-token';
import hashPassword from '../utils/hash-password';
import User from '../models/user';
import bcrypt from 'bcrypt';

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: 'EMAIL_NOT_FOUND',
        message: '등록되지 않은 이메일입니다.',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'INVALID_PASSWORD',
        message: '비밀번호가 올바르지 않습니다.',
      });
    }

    setUserToken(res, user);
    return res.json({ message: '로그인에 성공했습니다.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: '로그인에 실패했습니다.',
    });
  }
};

export const postJoin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    const hashedPassword = await hashPassword(password); 

    if (existingUser) {
      return res
        .status(400)
        .json({
          error: 'DUPLICATE_EMAIL',
          message: '이미 존재하는 이메일입니다.',
        });
    }

    await User.create({
      email,
      username,
      password: hashedPassword,
    });
    return res.json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        error: 'INTERNAL_ERROR',
        message: '회원가입 중 오류가 발생했습니다.',
      });
  }
};
