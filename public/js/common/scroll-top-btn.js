const setupScrollTopBtn = () => {
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('hidden', window.scrollY <= 100);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

export default setupScrollTopBtn;
