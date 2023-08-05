import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';
import showToast from '../components/toast-message.js';
import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
import categoryService from '../services/category-service.js';
import productService from '../services/product-service.js';
import { CLASSNAME, ERROR, SUCCESS, TOAST_TYPES } from '../utils/constants.js';

const handleSearch = (e) => {
  e.preventDefault();
  const searchTerm = document.getElementById('searchName').value.trim();
  renderProductsTable(searchTerm);
};

const handleDeleteProduct = async (event) => {
  const productId = event?.target.closest('tr')?.dataset.productId;
  if (!productId) return;

  const isConfirmed = confirm('정말로 이 상품을 삭제하시겠습니까?');

  if (isConfirmed) {
    const result = await productService.deleteProduct(productId);
    if (result.error) {
      showToast(result.error);
      return;
    }
    showToast('상품이 성공적으로 삭제되었습니다.', TOAST_TYPES.SUCCESS);
    renderProductsTable();
  }
};

const renderProduct = (product) => {
  const subCategoriesHTML = product.subCategories
    .map((sub) => `<span class="product-category__sub">${sub.name}</span>`)
    .join('');
  return `
    <tr class="product-table__row" data-product-id="${product._id}">
      <td>
        <div class="cell-wrapper product-category">
          <strong class="product-category__main">${
            product.mainCategory
          }</strong>
          ${subCategoriesHTML}
        </div>
      </td>
      <td>
        <div class="cell-wrapper product-info">
          <h4 class="product-info__title">${product.title}</h4>
          <p class="product-info__description">${product.description}</p>
          <span>${product.author} 저 / ${product.price.toLocaleString()}원 / ${
    product.pages
  }p</span>
        </div>
      </td>
      <td>
        <div class="cell-wrapper">
          <img class="product-image" src="${product.imageUrl}" alt="${
    product.title
  }" />
        </div>
      </td>
      <td>
        <div class="cell-wrapper product-management">
          <button class="btn edit-btn">수정</button>
          <button class="btn delete-btn">삭제</button>
        </div>
      </td>
    </tr>
  `;
};

const renderProductsTable = async (searchTerm = '') => {
  const response = await productService.getProducts();
  if (response.error) {
    showToast(response.error);
    return;
  }
  const products = response.data.products;

  let filteredProducts = products;
  if (searchTerm) {
    filteredProducts = products.filter((product) =>
      product.title.includes(searchTerm)
    );
  }

  const productTableBody = document.querySelector('.product-table tbody');

  if (filteredProducts.length === 0) {
    productTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">
          ${
            searchTerm
              ? '<p class="empty">검색된 상품이 없습니다.</p>'
              : '<p class="empty">상품이 없습니다.</p>'
          }
        </td>
      </tr>
    `;
  } else {
    productTableBody.innerHTML = filteredProducts.map(renderProduct).join('');
  }

  productTableBody.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', showEditForm);
  });
  productTableBody.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', handleDeleteProduct);
  });
};

const getFormValues = (form) => {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.subCategories = formData.getAll('subCategory');
  delete data['subCategory'];
  return data;
};

const submitProductForm = async (e) => {
  e.preventDefault();
  const subCategories = document.querySelectorAll(
    '#subCategory input[type="checkbox"]'
  );
  const isAnyChecked = [...subCategories].some((checkbox) => checkbox.checked);

  if (!isAnyChecked) {
    showToast(ERROR.CATEGORY_REQUIRED);
    return;
  }

  const form = e.target;
  const productData = getFormValues(form);
  const productId = form.dataset.productId;
  const method = productId ? 'updateProduct' : 'postProduct';
  const args = productId ? [productId, productData] : [productData];
  const toastMessage = productId
    ? SUCCESS.PRODUCT_UPDATED
    : SUCCESS.PRODUCT_POSTED;

  const result = await productService[method](...args);
  if (result.error) {
    showToast(result.error);
    return;
  }

  renderProductsTable();
  toggleFormDisplay();
  showToast(toastMessage, TOAST_TYPES.SUCCESS);
};

const renderSubCategories = async (
  mainCategory,
  selectedSubCategories = []
) => {
  const subCategoryContainer = document.getElementById('subCategory');
  const result = await categoryService.getCategories();
  if (result.error) {
    showToast(result.error);
    return;
  }
  const categories = result.data.categories;
  const subCategoryHTML = categories
    .filter((category) => category.type === mainCategory)
    .map((subCategory) => {
      const isChecked = selectedSubCategories.includes(subCategory._id)
        ? 'checked'
        : '';
      return `
        <div class="subCategories__item">
          <input 
            type="checkbox" 
            name="subCategory" 
            value="${subCategory._id}" 
            id="sub_${subCategory._id}" 
            ${isChecked}>
          <label for="sub_${subCategory._id}">${subCategory.name}</label>
        </div>
      `;
    })
    .join('');

  subCategoryContainer.innerHTML = subCategoryHTML;
};

const toggleFormDisplay = () => {
  document.querySelector('.product-view').classList.toggle(CLASSNAME.HIDDEN);
  document.querySelector('.product-edit').classList.toggle(CLASSNAME.HIDDEN);
};

const populateFormWithData = (data) => {
  for (let key in data) {
    let element = document.getElementById(key);
    if (element) {
      element.value = data[key] || '';
    }
  }
};

const showAddForm = () => {
  const formElement = document.getElementById('form');
  formElement.reset();
  formElement.dataset.productId = '';
  renderSubCategories(document.getElementById('mainCategory').value);
  const productEditTitle = document.getElementById('productEditTitle');
  productEditTitle.textContent = '상품 등록';
  toggleFormDisplay();
};

const showEditForm = async (event) => {
  const productId = event?.target.closest('tr')?.dataset.productId;
  if (!productId) return;

  const result = await productService.getProduct(productId);
  if (result.error) {
    showToast(result.error);
    return;
  }
  const productEditTitle = document.getElementById('productEditTitle');
  productEditTitle.textContent = '상품 수정';
  populateFormWithData(result.data);
  renderSubCategories(result.data.mainCategory, result.data.subCategories);
  toggleFormDisplay();

  const formElement = document.getElementById('form');
  formElement.dataset.productId = productId;
};

const bindEvents = () => {
  const addProductBtn = document.getElementById('addProductBtn');
  const showProductBtn = document.getElementById('showProductBtn');
  const mainCategory = document.getElementById('mainCategory');
  const form = document.getElementById('form');
  const searchForm = document.getElementById('searchForm');
  const cancleBtn = document.getElementById('cancleBtn');

  addProductBtn.addEventListener('click', showAddForm);
  showProductBtn.addEventListener('click', toggleFormDisplay);
  mainCategory.addEventListener('change', (event) => {
    renderSubCategories(event.target.value);
  });
  form.addEventListener('submit', submitProductForm);
  searchForm.addEventListener('submit', handleSearch);
  cancleBtn.addEventListener('click', toggleFormDisplay);
};

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  renderScrollTopBtn();
  bindEvents();
  renderProductsTable();
};

initPage();
