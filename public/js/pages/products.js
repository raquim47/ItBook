// 활성화된 카테고리 목록 가져오기
function getActiveCategories(buttons) {
  return buttons
    .filter((btn) => btn.classList.contains('active'))
    .map((btn) => btn.innerText);
}

// 상품리스트 UI 업데이트
function updateDisplay(productItems, activeCategories) {
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
}

document.addEventListener('DOMContentLoaded', () => {
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
});
