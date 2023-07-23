import commonModule from '../common/index.js';

commonModule();

document.addEventListener('DOMContentLoaded', function () {
  let slideIndex = 1; // 첫 번째 슬라이드부터 시작
  const slides = document.querySelectorAll('.main-slide__item');
  const list = document.querySelector('.main-slide__list');
  const dots = document.querySelectorAll('.dot');

  function updateSlide() {
    const offset = -(slides[0].clientWidth * (slideIndex - 1));
    list.style.transition = 'transform 0.5s';
    list.style.transform = `translateX(${offset}px)`;

    dots.forEach((dot) => dot.classList.remove('active'));
    dots[slideIndex - 1].classList.add('active');
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', function () {
      slideIndex = index + 1;
      updateSlide();
    });
  });

  updateSlide();

  window.addEventListener('resize', updateSlide);
});

document.addEventListener('DOMContentLoaded', function () {
  const sliderList = document.querySelector('.product-slider__list');
  const prevButton = document.querySelector('.product-slider__btn.prev');
  const nextButton = document.querySelector('.product-slider__btn.next');
  let slideIndex = 0;

  const slideGap = parseInt(getComputedStyle(sliderList).gap);
  let slideWidth =
    sliderList.querySelector('.product-item').clientWidth + slideGap;
  const slideCount = sliderList.querySelectorAll('.product-item').length;
  const maxIndex = slideCount - 3; // 최대로 움직일 수 있는 인덱스

  function updateNavigationButtons() {
    if (slideIndex === 0) {
      prevButton.style.display = 'none';
    } else {
      prevButton.style.display = 'block';
    }

    if (slideIndex >= maxIndex) {
      nextButton.style.display = 'none';
    } else {
      nextButton.style.display = 'block';
    }
  }

  prevButton.addEventListener('click', function () {
    if (slideIndex > 0) {
      slideIndex--;
      updateSlidePosition();
      updateNavigationButtons();
    }
  });

  nextButton.addEventListener('click', function () {
    if (slideIndex < maxIndex) {
      slideIndex++;
      updateSlidePosition();
      updateNavigationButtons();
    }
  });

  function updateSlidePosition() {
    const offset = -slideWidth * slideIndex;
    sliderList.style.transform = `translateX(${offset}px)`;
  }

  // 브라우저 크기 조절시 슬라이드 너비와 위치 조정
  window.addEventListener('resize', function () {
    slideWidth =
      sliderList.querySelector('.product-item').clientWidth + slideGap; // 슬라이드 너비 재계산
    updateSlidePosition();
  });

  // 처음 로드시 버튼 상태 초기화
  updateNavigationButtons();
});
