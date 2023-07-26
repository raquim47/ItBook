import renderScrollTopBtn from '../components/scroll-top-btn.js';
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
  let slideWidth =
    sliderList.querySelector('.product-item').clientWidth + slideGap;
  const slideCount = sliderList.querySelectorAll('.product-item').length;
  const maxIndex = slideCount - 3;

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
    slideWidth =
      sliderList.querySelector('.product-item').clientWidth + slideGap;
    updateProductSlidePosition(sliderList, -slideWidth * slideIndex);
  });
};

const initializeModule = () => {
  setupHeader();
  renderScrollTopBtn();
  setUpMainSlide();
  setUpProductSlide();
}

initializeModule();