import express from 'express';
import { asyncRenderHandler } from '../utils/asyncHandler';
import User from '../models/user';

const router = express.Router();

router.get(
  '/order',
  asyncRenderHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { username, email, address, phone } = user;

    res.render('order.ejs', {
      authStatus: req.user,
      userData: {
        username,
        email,
        address: address || '',
        phone: phone || '',
      },
      pageTitle: '주문서 - 잇북',
    });
  })
);

router.get(
  '/user/:section?',
  asyncRenderHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const section = req.params.section || 'mypage';
    const sectionTitles = {
      mypage: '마이페이지',
      edit: '회원정보 변경',
      order: '주문 내역',
      resign: '회원 탈퇴'
    };
    
    if (!['mypage', 'edit', 'order', 'resign'].includes(section)) {
      return res.status(404).render('error.ejs', {
        pageTitle: '404 - 페이지를 찾을 수 없습니다.',
      });
    }

    res.render('user.ejs', {
      authStatus: req.user,
      userData: user,
      section, 
      pageTitle: `${sectionTitles[section]} - 잇북`,
    });
  })
);

export default router;
