import Product from '../models/product';
import Category from '../models/category';

export const renderHomePage = async (req, res) => {
  try {
    let products;
    if (req.query.category) { // 카테고리가 쿼리 파라미터로 제공된 경우
      products = await Product.find({ category: req.query.category }).sort({createdAt: -1});
    } else {
      products = await Product.find().sort({createdAt: -1});
    }
    const categories = await Category.find();
    // 페이지 렌더링
    res.render('home.ejs', {
      products,
      categories,
      pageTitle: '잇북',
      path: '/',
    });
  } catch (err) {
    console.error(err);
    // 에러 페이지 렌더링. 'error'는 해당 오류 페이지의 템플릿 이름이라 가정합니다.
    // res.status(500).render('error', {
    //   message: '서버 오류',
    //   error: err,
    // });
  }
}