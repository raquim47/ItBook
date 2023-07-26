import renderScrollTopBtn from '../components/scroll-top-btn.js';
import setupHeader from '../components/header.js';

// 상품 정렬
const sortProducts = (productItems, sortValue) => {
  return productItems.slice().sort((a, b) => {
    switch (sortValue) {
      case 'newest':
        return (
          new Date(b.getAttribute('data-createdAt')) -
          new Date(a.getAttribute('data-createdAt'))
        );
      case 'oldest':
        return (
          new Date(a.getAttribute('data-createdAt')) -
          new Date(b.getAttribute('data-createdAt'))
        );
      case 'highPrice':
        return (
          Number(b.getAttribute('data-price')) -
          Number(a.getAttribute('data-price'))
        );
      case 'lowPrice':
        return (
          Number(a.getAttribute('data-price')) -
          Number(b.getAttribute('data-price'))
        );
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
    const itemCategories = item.getAttribute('data-category').split(', ');
    const matchesCategories = activeCategories.some((cat) =>
      itemCategories.includes(cat)
    );

    item.classList.toggle(
      'hidden',
      !(matchesCategories || activeCategories.length === 0)
    );
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  renderScrollTopBtn();

  const productItems = Array.from(document.querySelectorAll('.product-item'));
  const categoryBtns = Array.from(
    document.querySelectorAll('.products__subCategories li')
  );

  categoryBtns.forEach((button) => {
    button.addEventListener('click', (event) => {
      const categoryBtn = event.currentTarget;
      categoryBtn.classList.toggle('active');

      const activeCategories = getActiveCategories(categoryBtns);
      updateDisplay(productItems, activeCategories);
    });
  });

  const sortMenu = document.getElementById('sortMenu');
  sortMenu.addEventListener('change', () => {
    const sortedItems = sortProducts(productItems, sortMenu.value);
    const productList = document.querySelector('.products__list ul');
    productList.innerHTML = '';
    sortedItems.forEach((item) => productList.appendChild(item));
  });
});
