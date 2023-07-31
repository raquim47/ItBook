import { LOCAL_STORAGE_KEYS } from '../../../public/js/utils/constants';

// 체크박스 전체 선택
const checkBoxOnOff = (books) => {
  const allCheckBox = document.querySelector('#allCheck');
  const allSelectLabel = document.querySelector('.all-box-container>label');

  allSelectLabel.innerHTML = `전체선택(${books.length}/${books.length})`;
  allCheckBox.addEventListener('change', async () => {
    const selectCheckBoxs = document.querySelectorAll('.selectCheck');
    if (allCheckBox.checked) {
      selectCheckBoxs.forEach((box) => {
        box.checked = true;
        allSelectLabel.innerHTML = `전체선택(${books.length}/${books.length})`;
      });
    } else {
      selectCheckBoxs.forEach((box) => {
        box.checked = false;
        allSelectLabel.innerHTML = `전체선택(0/${books.length})`;
      });
    }
  });
};
// 상품 삭제
const deleteLocalItem = async (id, isLogin) => {
  if (!confirm('상품을 삭제하시겠습니까?')) return;

  if (isLogin) {
    try {
      const response = await fetch(`/api/user/cart/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
    } catch (error) {
      alert(error, '요청을 실패했습니다');
    }
  } else {
    const books = JSON.parse(localStorage.getItem('carts')) || '';
    const values = Object.values(books);
    if (books) {
      const updatedBooks = values.filter((obj) => obj.id !== id);
      localStorage.setItem('carts', JSON.stringify(updatedBooks));
    }
  }

  location.reload();
};

// 상품 갯수 빼기
const minusQuantityItem = async (id, isLogin) => {
  if (isLogin) {
    try {
      const response = await fetch(`/api/user/cart/${id}/decrease`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
    } catch (error) {
      alert(error, '요청을 실패했습니다');
    }
  } else {
    const books = JSON.parse(localStorage.getItem('carts')) || '';
    const values = Object.values(books);
    if (books) {
      const filteredBooks = values.filter((obj) => obj.id !== id);
      const findBook = values.find((obj) => obj.id == id);
      const index = values.findIndex((item) => item == findBook);
      const updatedBook =
        findBook.quantity > 1
          ? { ...findBook, quantity: findBook.quantity - 1 }
          : findBook;
      filteredBooks.splice(index, 0, updatedBook);
      localStorage.setItem('carts', JSON.stringify(filteredBooks));
    }
  }
  location.reload();
};

// 상품 갯수 더하기
const plusQuantityItem = async (id, isLogin) => {
  if (isLogin) {
    try {
      const response = await fetch(`/api/user/cart/${id}/increase`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
    } catch (error) {
      alert(error, '요청을 실패했습니다');
    }
  } else {
    const books = JSON.parse(localStorage.getItem('carts')) || '';
    const values = Object.values(books);
    if (books) {
      const filteredBooks = values.filter((obj) => obj.id !== id);
      const findBook = values.find((obj) => obj.id == id);
      const index = values.findIndex((item) => item == findBook);
      const updatedBook = { ...findBook, quantity: findBook.quantity + 1 };
      filteredBooks.splice(index, 0, updatedBook);
      localStorage.setItem('carts', JSON.stringify(filteredBooks));
    }
  }
  location.reload();
};

// 총 금액 계산
const paymentResult = (total) => {
  const totalPre = document.querySelector('.total-pre');
  const totalPrice = document.querySelector('.total-price');
  const orderBtn = document.querySelector('.btn-order');
  const delivery = document.querySelector('.delivery');
  const addCommas = (number) =>
    number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (total == 0) {
    orderBtn.innerHTML = `주문하기`;
    totalPrice.innerHTML = `0원`;
    totalPre.innerHTML = `0원`;
    return;
  } else if (total < 30000) {
    delivery.innerHTML = `+3,000원`;
    orderBtn.innerHTML = `${addCommas(total + 3000)}원 주문하기`;
    totalPrice.innerHTML = `${addCommas(total)}원`;
    totalPre.innerHTML = `${addCommas(total + 3000)}원`;
    return;
  } else {
    orderBtn.innerHTML = `${addCommas(total)}원 주문하기`;
    totalPrice.innerHTML = `${addCommas(total)}원`;
    totalPre.innerHTML = `${addCommas(total)}원`;
  }
};

// html 템플릿
const itemTemplate = (book) => {
  const addCommas = (number) =>
    number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `
  <input type="checkbox" class="selectCheck" data-id="${
    book._id
  }" data-quantity="${book.quantity}" checked>
  <a href="/product/${book._id}" class="item-info">
    <img class="item-img" src="${book.imageUrl}" alt="도서 사진">
    <div class="info-text">
      <p class="info-title">${book.title}</p>
      <p class="description">${book.author}</p>
    </div>
  </a>
  <div class="item-count">
    <button id="minusBtn" class="btn-minus"><i class="fa-solid fa-minus"></i></button>
      <input type="number" class="item-num" id="item-number" value=${
        book.quantity
      }>
      <button id="plusBtn" class="btn-plus"><i class="fa-solid fa-plus"></i></button>
  </div>
  <p class="item-price">${addCommas(book.price * book.quantity)}원</p>
  <button id="deleteBtn" class="btn-delete"><i class="fa-solid fa-xmark"></i></button>
  `;
};

// 토큰 (로그인 확인)
const getTokenFromCookie = () => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// 서버에서 유저 카트 정보 가져오기
const getCartFromDB = async () => {
  try {
    const response = await fetch('/api/user/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('실패');
    }
  } catch (err) {
    console.error(err);
  }
};

// 로컬스토래지에서 카트 정보 가져오기
const getCartFromLocalStrorage = () => {
  const carts = JSON.parse(localStorage.getItem('carts'));
  return carts;
};

window.addEventListener('load', async () => {
  const isLogin = getTokenFromCookie();
  const cartData =
    (isLogin ? await getCartFromDB() : getCartFromLocalStrorage()) ?? [];
  const ul = document.querySelector('.cart-list');
  checkBoxOnOff(cartData);
  let totalPrice = 0;

  if (cartData.length > 0) {
    const promises = cartData.map(async (book) => {
      const li = document.createElement('li');
      li.setAttribute('class', 'cart-item');
      li.setAttribute('id', book.id);
      try {
        const response = await fetch(`/api/product/${book.id}`);
        if (!response.ok) {
          throw new Error(`DB에 해당 상품이 없습니다. id: ${book.id}`);
        }
        const bookData = await response.json();

        totalPrice += parseInt(bookData.price) * book.quantity;
        bookData.quantity = book.quantity;
        li.innerHTML = itemTemplate(bookData);

        // 버튼 이벤트
        li.querySelector('#deleteBtn').addEventListener('click', () =>
          deleteLocalItem(book.id, isLogin)
        );
        li.querySelector('#plusBtn').addEventListener('click', () =>
          plusQuantityItem(book.id, isLogin)
        );
        li.querySelector('#minusBtn').addEventListener('click', () =>
          minusQuantityItem(book.id, isLogin)
        );

        ul.append(li);
      } catch (error) {
        // DB에 해당 상품id가 없으면 로컬 스토래지에서도 삭제
        const books = getCartFromLocalStrorage();
        const updatedBooks = books.filter((b) => b.id !== book.id);
        localStorage.setItem('carts', JSON.stringify(updatedBooks));
      }
    });

    await Promise.all(promises);
  }

  paymentResult(totalPrice);
});

orderBtn.addEventListener('click', () => {
  if (!getTokenFromCookie()) {
    alert('로그인이 필요합니다.');
    return;
  }

  if (confirm('선택한 상품을 주문하시겠습니까?')) {
    const selectedCheckboxes = document.querySelectorAll(
      '.selectCheck:checked'
    );
    const selectedItems = Array.from(selectedCheckboxes).map((checkbox) => ({
      id: checkbox.dataset.id,
      quantity: checkbox.dataset.quantity,
    }));
    // localStorage에 저장
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.ORDER_ITEMS,
      JSON.stringify(selectedItems)
    );
    // 주문 페이지로 이동
    window.location.href = '/order';
  }
});
