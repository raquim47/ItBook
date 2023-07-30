import renderScrollTopBtn from '../components/scroll-top-btn.js';
import setupHeader from '../components/header.js';

// 상품 정렬
const sortProducts = (productItems, sortValue) => {
  return productItems.slice().sort((a, b) => {
    switch (sortValue) {
      case 'newest':
        return new Date(b.dataset.createdAt) - new Date(a.dataset.createdAt);
      case 'oldest':
        return new Date(a.dataset.createdAt) - new Date(b.dataset.createdAt);
      case 'highPrice':
        return Number(b.dataset.price) - Number(a.dataset.price);
      case 'lowPrice':
        return Number(a.dataset.price) - Number(b.dataset.price);
      default:
        return 0;
    }
  });
};
// 활성화된 카테고리 목록 가져오기
const getActiveCategories = (buttons) => {
  return buttons
    .filter((btn) => btn.classList.contains('active'))
    .map((btn) => btn.innerText);
};

// 상품리스트 UI 업데이트
const updateDisplay = (productItems, activeCategories) => {
  productItems.forEach((item) => {
    const itemCategories = item.dataset.categories.split(', ');
    const matchesCategories = activeCategories.some((cat) =>
      itemCategories.includes(cat)
    );

    item.classList.toggle(
      'hidden',
      !(matchesCategories || activeCategories.length === 0)
    );
  });
};

// 카테고리 버튼 이벤트 바인딩
const bindCateBtnEvents = (categoryBtns, productItems) => {
  categoryBtns.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      const activeCategories = getActiveCategories(categoryBtns);
      updateDisplay(productItems, activeCategories);
    });
  });
};

// 메뉴 정렬 이벤트 바인딩
const bindSortMenuEvents = (productItems) => {
  const sortMenu = document.getElementById('sortMenu');
  sortMenu.addEventListener('change', () => {
    const sortedItems = sortProducts(productItems, sortMenu.value);
    const productList = document.querySelector('.products__list ul');
    productList.innerHTML = '';
    sortedItems.forEach((item) => productList.appendChild(item));
  });
};

const initPage = () => {
  setupHeader();
  renderScrollTopBtn();

  const productItems = Array.from(document.querySelectorAll('.product-item'));
  const categoryBtns = Array.from(
    document.querySelectorAll('.products__subCategories li')
  );

  bindCateBtnEvents(categoryBtns, productItems);
  bindSortMenuEvents(productItems);
};

initPage();
