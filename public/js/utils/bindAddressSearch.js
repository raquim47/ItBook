// 배송지 검색 바인딩(다음 주소 api)
const bindAddressSearch = () => {
  document
    .querySelector('.address-search-btn')
    .addEventListener('click', () => {
      new daum.Postcode({
        oncomplete: (data) => {
          document.querySelector('#address').value = data.roadAddress;
        },
      }).open();
    });
};

export default bindAddressSearch;