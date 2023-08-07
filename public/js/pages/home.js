import renderScrollTopBtn from '../components/scroll-top-btn.js';
import authService from '../services/auth-service.js';
import cartService from '../services/cart-service.js';
import setupHeader from '../components/header.js';

// 메인 슬라이드 - 슬라이드 이동
const updateMainSlidePosition = (slideIndex, slides, list) => {
  const offset = -(slides[0].clientWidth * (slideIndex - 1));
  list.style.transform = `translateX(${offset}px)`;
};

// 메인 슬라이드 - Pagination 버튼 활성화
const updateMainSlidePagination = (slideIndex, dots) => {
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === slideIndex - 1);
  });
};

// 메인 슬라이드 - initialize
const setUpMainSlide = () => {
  const slides = document.querySelectorAll('.main-slide__item');
  const list = document.querySelector('.main-slide__list');
  const dots = document.querySelectorAll('.main-slide__dot');
  let slideIndex = 1;

  updateMainSlidePosition(slideIndex, slides, list);
  updateMainSlidePagination(slideIndex, dots);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      slideIndex = index + 1;
      updateMainSlidePosition(slideIndex, slides, list);
      updateMainSlidePagination(slideIndex, dots);
    });
  });

  window.addEventListener('resize', () => {
    updateMainSlidePosition(slideIndex, slides, list);
    updateMainSlidePagination(slideIndex, dots);
  });
};

// Product 슬라이드 - 슬라이드 이동
const updateProductSlidePosition = (sliderList, offset) => {
  sliderList.style.transform = `translateX(${offset}px)`;
};

// Product 슬라이드 - 네비게이션 버튼 업데이트
const updateProductNavigationBtns = (
  slideIndex,
  maxIndex,
  prevButton,
  nextButton
) => {
  prevButton.classList.toggle('hidden', slideIndex === 0);
  nextButton.classList.toggle('hidden', slideIndex >= maxIndex);
};

// Product 슬라이드 - 초기화
const setUpProductSlide = () => {
  const sliderList = document.querySelector('.product-slider__list');
  const prevButton = document.querySelector('.product-slider__btn.prev');
  const nextButton = document.querySelector('.product-slider__btn.next');
  let slideIndex = 0;

  const slideGap = parseInt(getComputedStyle(sliderList).gap);

  // Viewport width에 따른 maxIndex와 slideWidth를 결정하는 함수
  const updateSlideProperties = () => {
    let slideWidth =
      sliderList.querySelector('.product-item').clientWidth + slideGap;

    // 768px 이하일 때
    if (window.innerWidth <= 768) {
      return {
        slideWidth,
        maxIndex: sliderList.querySelectorAll('.product-item').length - 1,
      };
    }

    // 768px 초과일 때
    return {
      slideWidth,
      maxIndex: sliderList.querySelectorAll('.product-item').length - 3,
    };
  };

  let { slideWidth, maxIndex } = updateSlideProperties();

  updateProductSlidePosition(sliderList, -slideWidth * slideIndex);
  updateProductNavigationBtns(slideIndex, maxIndex, prevButton, nextButton);

  prevButton.addEventListener('click', () => {
    if (slideIndex > 0) {
      slideIndex--;
      updateProductSlidePosition(sliderList, -slideWidth * slideIndex);
      updateProductNavigationBtns(
        slideIndex,
        maxIndex,
        prevButton,
        nextButton
      );
    }
  });

  nextButton.addEventListener('click', () => {
    if (slideIndex < maxIndex) {
      slideIndex++;
      updateProductSlidePosition(sliderList, -slideWidth * slideIndex);
      updateProductNavigationBtns(
        slideIndex,
        maxIndex,
        prevButton,
        nextButton
      );
    }
  });

  window.addEventListener('resize', () => {
    // 뷰포트 너비 변경 시 maxIndex와 slideWidth 업데이트
    ({ slideWidth, maxIndex } = updateSlideProperties());
    updateProductSlidePosition(sliderList, -slideWidth * slideIndex);
  });
};


const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  renderScrollTopBtn();
  setUpMainSlide();
  setUpProductSlide();
}

initPage();