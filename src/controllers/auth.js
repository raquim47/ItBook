import setUserToken from '../utils/set-user-token';
import hashPassword from '../utils/hash-password';
import User from '../models/user';

export const postLogin = (req, res) => {
  try {
    setUserToken(res, req.user);
  } catch (err) {
    res.status(500).send('로그인에 실패했습니다.');
  }
  res.redirect('/');
};

export const postJoin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    const hashedPassword = hashPassword(password);

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
