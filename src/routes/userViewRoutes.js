import express from 'express';
import { asyncRenderHandler } from '../utils/asyncHandler';
import User from '../models/user';
import { ERROR_PAGE } from '../../public/js/utils/constants';

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
    const user = await User.findById(req.user._id).populate('wishList');
    const section = req.params.section || 'mypage';
    const sectionTitles = {
      mypage: '마이페이지',
      edit: '회원정보 변경',
      order: '주문 내역',
      resign: '회원 탈퇴'
    };
    
    if (!['mypage', 'edit', 'order', 'resign'].includes(section)) {
      return res.status(404).render('error', ERROR_PAGE[404]);
    }
    res.render('user.ejs', {
      authStatus: req.user,
      userData: user,
      wishList: user.wishList,  
      section, 
      pageTitle: `${sectionTitles[section]} - 잇북`,
    });
  })
);

export default router;
