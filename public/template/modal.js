// 모달창
const showModal = (mode) => {
  const loginModalContent = document.querySelector('#loginModalContent');
  const joinModalContent = document.querySelector('#joinModalContent');
  const bg = document.querySelector('.modal-bg');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 유효성 검사 오류 메시지 추가
  const addErrorMessage = (field, message) => {
    const errorMessage = field.nextElementSibling;
    if (errorMessage) {
      errorMessage.remove();
    }
    field.closest('.input-box').classList.add('error');
    field.insertAdjacentHTML(
      'afterend',
      `<p class="text-valid show">${message}</p>`
    );
  };
  // 유효성 검사 오류 메시지 제거
  const removeErrorMessage = (field) => {
    const errorMessage = field.nextElementSibling;
    if (errorMessage) {
      errorMessage.remove();
    }
    field.closest('.input-box').classList.remove('error');
  };

  if (mode === 'login') {
    bg.classList.add('show');
    loginModalContent.classList.add('show');

    const loginEmail = document.querySelector('#loginEmail');
    const loginPassword = document.querySelector('#loginPassword');
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener(
      'submit',
      async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!emailRegex.test(loginEmail.value) || !loginPassword.value) {
          if (!emailRegex.test(loginEmail.value)) {
            loginEmail.closest('.input-box').classList.add('error');
            addErrorMessage(
              loginEmail,
              '유효한 이메일을 입력해주세요. (예: user@itbook.com)'
            );
          } else {
            removeErrorMessage(loginEmail);
          }

          if (!loginPassword.value) {
            loginPassword.closest('.input-box').classList.add('error');
            addErrorMessage(loginPassword, '비밀번호을 입력해주세요.');
          } else {
            removeErrorMessage(loginPassword);
          }

          return false;
        }

        //fetch
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value,
          }),
        });

        if (response.ok) {
          alert('로그인 성공');
          // 로그인 후 장바구니 데이터 병합
          const localCarts = JSON.parse(localStorage.getItem('carts'));
          if (localCarts && localCarts.length > 0) {
            localStorage.setItem(
              LOCAL_STORAGE_KEYS.CART_ITEMS,
              JSON.stringify([])
            );
            try {
              const response = await fetch('/api/user/cart/merge', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(localCarts),
              });

              if (!response.ok) {
                throw new Error('서버 응답 오류');
              }

              const result = await response.json();
            } catch (error) {
              console.error('요청을 실패했습니다', error);
            }
          }
          window.location.reload();
        } else {
          alert(`로그인 실패`);
        }
      },
      { once: true }
    );
  } else if (mode === 'join') {
    bg.classList.add('show');
    joinModalContent.classList.add('show');

    const joinUserName = document.querySelector('#joinUserName');
    const joinEmail = document.querySelector('#joinEmail');
    const joinPassword = document.querySelector('#joinPassword');
    const passwordCheck = document.querySelector('#passwordCheck');
    const joinForm = document.querySelector('#joinForm');

    joinForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 유효성 검사
      if (
        !joinUserName.value ||
        !emailRegex.test(joinEmail.value) ||
        !joinPassword.value ||
        joinPassword.value !== passwordCheck.value
      ) {
        if (!joinUserName.value) {
          joinUserName.closest('.input-box').classList.add('error');
          addErrorMessage(joinUserName, '이름을 입력해주세요.');
        } else {
          removeErrorMessage(joinUserName);
        }

        if (!emailRegex.test(joinEmail.value)) {
          joinEmail.closest('.input-box').classList.add('error');
          addErrorMessage(
            joinEmail,
            '유효한 이메일을 입력해주세요. (예: user@itbook.com)'
          );
        } else {
          removeErrorMessage(joinEmail);
        }

        if (joinPassword.value !== passwordCheck.value) {
          joinPassword.closest('.input-box').classList.add('error');
          passwordCheck.closest('.input-box').classList.add('error');
          addErrorMessage(passwordCheck, '비밀번호가 맞지 않습니다.');
        } else {
          removeErrorMessage(joinPassword);
          removeErrorMessage(passwordCheck);
        }

        if (!joinPassword.value) {
          joinPassword.closest('.input-box').classList.add('error');
          addErrorMessage(joinPassword, '비밀번호을 입력해주세요.');
        } else {
          removeErrorMessage(joinPassword);
        }
        return false;
      }

      //fetch
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: joinUserName.value,
          email: joinEmail.value,
          password: joinPassword.value,
        }),
      });

      if (response.ok) {
        alert('회원가입 성공');
        // 회원가입 성공 시 메인페이지로 이동
        window.location.href = '/';
      } else {
        const errorText = await response.json();
        alert(errorText);
      }
    });
  }
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('input', function () {
      this.closest('.input-box').classList.remove('error');
      removeErrorMessage(input);
    });
  });

  // 인풋창 포커스in-out
  const inputBoxes = document.querySelectorAll('.input-box');
  const inputBoxFocusIn = (e) => {
    e.currentTarget.classList.add('focus');
    if (e.target.value) {
      e.currentTarget.classList.remove('active');
    }
  };
  const inputFocusIn = (e) => {
    e.stopPropagation();
  };
  const inputBoxFocusOut = (e) => {
    e.currentTarget.classList.remove('focus');
    if (e.target.value) {
      e.currentTarget.classList.add('active');
    }
  };
  const inputFocusOut = (e) => {
    e.stopPropagation();
  };
  inputBoxes.forEach((inputBox) => {
    inputBox.addEventListener('focusin', inputBoxFocusIn, { capture: true });
    inputBox.addEventListener('focusout', inputBoxFocusOut, {
      capture: true,
    });
  });
  inputs.forEach((input) => {
    input.addEventListener('focusin', inputFocusIn);
    input.addEventListener('focusout', inputFocusOut);
  });

  // 닫기
  const closeBtn = document.querySelectorAll('.btn-close');
  const modalClose = () => {
    bg.classList.remove('show');
    loginModalContent.classList.remove('show');
    joinModalContent.classList.remove('show');

    // 인풋값 비우기
    inputs.forEach((input) => {
      input.value = '';
    });

    // 에러 메시지 요소 제거
    const errorMessages = document.querySelectorAll('.text-valid');
    errorMessages.forEach((errorMessage) => {
      errorMessage.remove();
    });

    // inputbox 클래스 제거
    inputBoxes.forEach((inputBox) => {
      inputBox.classList.remove('error', 'active');
    });
  };

  closeBtn.forEach((btn) => {
    btn.addEventListener('click', modalClose);
  });
  document.querySelector('.modal-bg').addEventListener('click', modalClose);
};

const modal = async () => {
  const div = document.createElement('div');
  document.body.prepend(div);
  const loginModalContent = `
    <div class="modal fade" id="loginModalContent">
  <div class="modal-header">
  <h2 class="modal-title">로그인</h2>
  <button class="btn-close"><i class="fa-solid fa-xmark"></i></button>
  </div>
  <div class="modal-body">
  <form id="loginForm" class="form">
    <ul class="form-list">
      <li class="input-box">
        <label class="label" for="loginEmail">이메일</label>
        <input
          type="email"
          name="loginEmail"
          autocomplete="off"
          id= "loginEmail"
        />
      </li>
      <li class="input-box">
        <label class="label" for="loginPassword">비밀번호</label>
        <input type="password" name="password" id="loginPassword" autocomplete="off" />
      </li>
    </ul>
  </form>
  </div>
  <div class="modal-footer">
  <button type="submit" form="loginForm">로그인</button>
  </div>
  </div>
  </div>
  `;
  const joinModalContent = `
  <div class="modal fade" id="joinModalContent">
  <div class="modal-header">
  <h2 class="modal-title">회원가입</h2>
  <button class="btn-close"><i class="fa-solid fa-xmark"></i></button>
</div>
<div class="modal-body">

  <form id="joinForm"  method="POST" class="form">
    <ul class="form-list">
      <li class="input-box">
        <label class="label" for="joinEmail">이메일</label>
        <input type="text" name="joinEmail" id="joinEmail" />
      </li>
      <li class="input-box">
        <label class="label" for="joinUserName">이름</label>
        <input type="text" name="joinUserName" id="joinUserName" />
      </li>
      <li class="input-box">
        <label class="label" for="joinPassword">비밀번호</label>
        <input type="password" name="joinPassword" id="joinPassword" autocomplete="off" />
      </li>
      <li class="input-box">
        <label class="label" for="passwordCheck">비밀번호 확인</label>
        <input type="password" name="passwordCheck" id="passwordCheck" autocomplete="off" />
      </li>
    </ul>
  </form>
</div>
<div class="modal-footer">
  <button type="submit" form="joinForm">회원가입</button>
</div>
</div>
</div>
      `;

  const modalBg = document.createElement('div');
  modalBg.classList.add('modal-bg', 'fade');
  div.append(modalBg);

  document.body.prepend(div);
  div.insertAdjacentHTML('afterbegin', joinModalContent);
  div.insertAdjacentHTML('afterbegin', loginModalContent);
};

export { modal, showModal };
