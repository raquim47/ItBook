const renderScrollTopBtn = () => {
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className ='scroll-top-btn hidden';
  scrollTopBtn.setAttribute('aria-label', '스크롤 최상단으로 이동');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('hidden', window.scrollY <= 100);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.append(scrollTopBtn);
};

export default renderScrollTopBtn;
