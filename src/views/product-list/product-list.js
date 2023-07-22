// book 데이터 요청
const fetchBooks = async (category) => {
  try {
    let response;
    if (category === '전체') {
      response = await fetch(`/api/products`);
    } else {
      response = await fetch(`/api/products?category=${category}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};


// sortMenu로 정렬
const sortBooks = (books, sortOption) => {
  console.log('hi')
  let sortedBooks = [...books];  
  switch (sortOption) {
    case '가격낮은순':
      return sortedBooks.sort((a, b) => a.price - b.price);
    case '가격높은순':
      return sortedBooks.sort((a, b) => b.price - a.price);
    case '최신순':
      return sortedBooks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case '오래된순':
      return sortedBooks.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    default:
      return sortedBooks;
  }
};

// 화면 렌더링
const displayBooks = (books, category, sortOption = '최신순')  => {
  const addCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const booksHTML = books
    .map(
      (book) =>
        `<li>
          <a href="/product/${book._id}">
            <img src="${book.imageUrl}" alt="${book.title}" />
            <div class="info">
              <p class="cate">${book.category}</p>
              <p class="name">${book.title}</p>
              <p class="price">${addCommas(book.price)}원</p>
            </div>
          </a>
        </li>`
    )
    .join('');

  const wrap = document.querySelector('.wrap');
  wrap.innerHTML = `
    <div class="product-title">
      <h2>${category}</h2>
      <p>총 ${books.length}개</p>
    </div>
    <div class="select-wrap">
      <select id="sortMenu">
          <option value="최신순">최신순</option>
          <option value="오래된순">오래된순</option>
          <option value="가격높은순">가격높은순</option>
          <option value="가격낮은순">가격낮은순</option>
      </select>
    </div>
    <div class="product-list">
      <div class="b-list">
        <ul class="list-box">
          ${booksHTML}
        </ul>
      </div>
    </div>`;

  const sortMenu = document.getElementById('sortMenu');
  sortMenu.value = sortOption; 

  sortMenu.addEventListener('change', async (event) => {
    console.log('hi')
    sortOption = event.target.value;
    books = sortBooks(books, sortOption);  
    displayBooks(books, category, sortOption);  
  });
}

// 페이지 로드 시에 Category에 따라 도서 데이터를 받아오고 화면에 표시.
const productsByCategory = async() => {
  const url = window.location.pathname;
  const parts = url.split("/").filter(Boolean);
  const category = decodeURIComponent(parts.pop());

  let books = await fetchBooks(category);
  let sortOption = '최신순';  

  displayBooks(books, category, sortOption);
}


productsByCategory();