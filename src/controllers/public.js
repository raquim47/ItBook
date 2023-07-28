import Product from '../models/product';
import Category from '../models/category';

export const renderHomePage = async (req, res) => {
  try {
    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('subCategories');

    const recommendedProducts = await Product.find({ isRecommended: true })
      .populate('subCategories')
      .sort({ createdAt: -1 });

    res.render('home.ejs', {
      authStatus : !!req.user,
      newProducts,
      recommendedProducts,
      pageTitle: '잇북',
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('404.ejs', {
      message: '서버 오류',
      error: err,
    });
  }
};

export const renderProductListPage = async (req, res) => {
  const { mainCategory } = req.params;

  if (!['all', 'frontend', 'backend', 'cs'].includes(mainCategory)) {
    return res.status(404).render('404.ejs', {
      pageTitle: '404 - 페이지를 찾을 수 없습니다.',
    });
  }

  const productFilter = mainCategory !== 'all' ? { mainCategory } : {};
  const categoryFilter = mainCategory !== 'all' ? { type: mainCategory } : {};
  const categoryMap = {
    all: '전체',
    frontend: '프론트엔드',
    backend: '백엔드',
    cs: 'CS',
  };
  try {
    const products = await Product.find(productFilter)
      .populate('subCategories')
      .sort({ createdAt: -1 });
    const subCategories = await Category.find(categoryFilter);
    res.render('product-list.ejs', {
      authStatus : !!req.user,
      products,
      title: categoryMap[mainCategory],
      pageTitle: `${categoryMap[mainCategory]} - 잇북`,
      subCategories,
      mainCategory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('404.ejs', {
      message: '서버 오류',
      error: err,
    });
  }
};

export const renderProductDetailPage = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).populate('subCategories');
    res.render('product-detail.ejs', {
      authStatus : !!req.user,
      product,
      pageTitle: `${product.title} - 잇북`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('404.ejs', {
      message: '서버 오류',
      error: err,
    });
  }
};

export const renderCartPage = async (req, res) => {
  try {
    res.render('cart.ejs', {
      authStatus : !!req.user,
      pageTitle: `장바구니 - 잇북`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('404.ejs', {
      message: '서버 오류',
      error: err,
    });
  }
}
