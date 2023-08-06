import setupHeader from '../components/header.js';
import renderScrollTopBtn from '../components/scroll-top-btn.js';
import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
import categoryService from '../services/category-service.js';
import { CLASSNAME } from '../utils/constants.js';

// JS: Category Management

const handleFilterChange = (e) => {
  const filterValue = e.target.value;
  renderCategoriesTable(filterValue);
};

const handleDeleteCategory = async (event) => {
  const categoryId = event?.target.closest('tr')?.dataset.cateId;
  if (!categoryId) return;

  if (confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
    const result = await categoryService.deleteCategory(categoryId);
    if (result.error) return;
    renderCategoriesTable();
  }
};

const renderCategory = (cate) => {
  return `
    <tr class="cate-table__row" data-cate-id="${cate._id}">
      <td>${cate.type}</td>
      <td>${cate.name}</td>
      <td>
        <div class="cell-wrapper">
          <button class="btn edit-btn">수정</button>
          <button class="btn delete-btn">삭제</button>
        </div>
      </td>
    </tr>
  `;
};

const renderCategoriesTable = async (filter = '전체') => {
  const result = await categoryService.getCategories();
  if (result.error) return;
  const categories = result.data;

  let filteredCategories = categories;
  if (filter !== '전체') {
    filteredCategories = categories.filter((cate) => cate.type === filter);
  }

  const cateTableBody = document.querySelector('.cate-table tbody');

  if (filteredCategories.length === 0) {
    cateTableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-cell">
          <p class="empty">카테고리가 없습니다.</p>
        </td>
      </tr>
    `;
  } else {
    cateTableBody.innerHTML = filteredCategories.map(renderCategory).join('');
  }

  cateTableBody.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', showEditForm);
  });
  cateTableBody.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', handleDeleteCategory);
  });
};

const submitCategoryForm = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  let categoryData = {};
  formData.forEach((value, key) => {
    categoryData[key] = value;
  });
  const categoryId = form.dataset.cateId;
  const method = categoryId ? 'putCategory' : 'postCategory';
  const args = categoryId ? [categoryId, categoryData] : [categoryData];
  const result = await categoryService[method](...args);
  if (!result.error) {
    renderCategoriesTable();
    toggleFormDisplay();
  }
};

const toggleFormDisplay = () => {
  document.getElementById('viewTable').classList.toggle(CLASSNAME.HIDDEN);
  document.getElementById('editForm').classList.toggle(CLASSNAME.HIDDEN);
};

const showAddForm = () => {
  const formElement = document.getElementById('form');
  formElement.reset();
  formElement.dataset.cateId = '';
  const editTitle = document.getElementById('editTitle');
  editTitle.textContent = '카테고리 등록';
  toggleFormDisplay();
};

const showEditForm = async (event) => {
  const categoryId = event?.target.closest('tr')?.dataset.cateId;
  if (!categoryId) return;

  const result = await categoryService.getCategory(categoryId);
  if (result.error) return;
  const cate = result.data;

  const editTitle = document.getElementById('editTitle');
  editTitle.textContent = '카테고리 수정';
  document.getElementById('mainCateSelect').value = cate.type;
  document.getElementById('subCateInput').value = cate.name;
  toggleFormDisplay();

  const formElement = document.getElementById('form');
  formElement.dataset.cateId = categoryId;
};

const bindEvents = () => {
  const addCateBtn = document.getElementById('addCateBtn');
  const mainCateFilter = document.getElementById('mainCateFilter');
  const form = document.getElementById('form');
  const cancleBtn = document.querySelector('.cancle-btn');
  const showViewBtn = document.getElementById('showViewBtn');

  addCateBtn.addEventListener('click', showAddForm);
  mainCateFilter.addEventListener('change', handleFilterChange);
  form.addEventListener('submit', submitCategoryForm);
  cancleBtn.addEventListener('click', toggleFormDisplay);
  showViewBtn.addEventListener('click', toggleFormDisplay);
};

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  renderScrollTopBtn();
  bindEvents();
  renderCategoriesTable();
};

initPage();
