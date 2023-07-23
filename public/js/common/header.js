const setupHeader = () => {
  // 스크롤 시 헤더 고정
  window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    const windowScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    header.classList.toggle('shadow', header.offsetTop < windowScroll);
  });
};

export default setupHeader;
