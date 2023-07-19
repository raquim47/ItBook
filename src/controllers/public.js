import Product from '../models/product';
import Category from '../models/category';

export const renderHomePage = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.render('home.ejs', {
      products,
      pageTitle: '잇북',
    });
  } catch (err) {
    console.error(err);
    // 에러 페이지 렌더링. 'error'는 해당 오류 페이지의 템플릿 이름이라 가정합니다.
    // res.status(500).render('error', {
    //   message: '서버 오류',
    //   error: err,
    // });
  }
};

export const renderProductsPage = async (req, res) => {
  const { mainCategory } = req.params;

  if (!['all', 'frontend', 'backend'].includes(mainCategory)) {
    return res.status(404).render('404.ejs');
  }

  const filter = mainCategory !== 'all' ? { mainCategory } : {};
  const categoryMap = {
    all : '전체',
    frontend : '프론트엔드',
    backend : '백엔드'
  }
  try {
    const products = await Product.find(filter).sort({createdAt: -1});
    res.render('products.ejs', {
      products,
      pageTitle: `${categoryMap[mainCategory]} - 잇북`,
      mainCategory  // 활성 카테고리 설정
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: '서버 오류',
      error: err,
    });
  }
};
