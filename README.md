# 잇북(IT-Book) : 개발 서적 판매 쇼핑몰 Project

## 데모 링크
 - http://kdt-sw-5-team15.elicecoding.com/
 - 일반 사용자 계정 : test@test.com / 123456
 - 관리자 계정 : admin@admin.com / 123456

## 개요
 - IT-Book은 개발 관련 서적을 판매하는 온라인 쇼핑몰입니다. 이 프로젝트는 바닐라 자바스크립트, CSS, EJS, Node.js Express, MongoDB, 그리고 Mongoose를 사용하여 제작되었습니다. 

## 주요 구현 사항 
1. **유저 정보 관리**: 회원가입/로그인, 회원 정보 수정, 회원 탈퇴 등의 기능을 제공.
2. **상품 관련 기능**: 카테고리별로 상품을 조회하고, 상품의 상세 정보를 확인.  
3. **장바구니 기능**: 비로그인 사용자의 장바구니 정보는 LocalStorage에 저장하고, 로그인 시에는 DB에 저장되어 사용자 경험을 향상.
4. **관리자 기능**: 관리자는 상품, 주문, 카테고리 정보에 대한 CRUD 연산을 수행.

## 7.19 ~ 8.7 프로젝트 이후 기능 추가 구현, 리팩토링 진행
1. **EJS 도입과 화면 렌더링 개선**: EJS를 도입하여 SSR과 CSR을 혼합한 유연한 화면 렌더링을 구현.
2. **API 요청 로직 모듈화**: API 요청 로직을 클래스 메서드로 분리하여 모듈화하여 코드의 가독성과 유지보수성을 향상.
3. **API 요청 모듈 핸들러**: API를 요청하는 모듈 핸들러를 만들어서 간결하고 추상화된 API 요청 메서드를 구현.
4. **서버와 클라이언트의 상태 동기화**: 장바구니, 인증 정보 등의 상태를 서버와 동기화하여 로직을 구현.
5. **커스텀 이벤트 활용**: 커스텀 이벤트를 사용하여 모듈간 의존성을 줄이고 각 모듈을 독립적으로 실행할 수 있도록 설계.
6. **Toast UI 추가**: 에러 메시지와 성공 메시지를 시각적으로 표현하여 사용자 경험을 향상.
7. **카테고리 재구성**: 카테고리를 대분류와 소분류로 재구성하여 효율적인 상품 분류 가능.
8. **관리자 페이지 리뉴얼**: 관리자 페이지를 리뉴얼, 상품, 주문, 카테고리 관리 로직을 개선. 분류에 따라 조회할 수 있는 기능 추가.
9. **함수형 프로그래밍**: 코드의 품질과 가독성을 향상시키기 위해 함수형 프로그래밍 도입.
10. **상수 모듈화**: 메시지, 키, 상태값 등을 별도의 상수 모듈로 분리하여 관리.
11. **상품 찜하기 기능** 추가**: 사용자가 찜한 상품을 마이페이지에서 확인 가능.
12. **웹 디자인 개선**: 시멘틱 마크업을 재설계하고 반응형 디자인을 개선.
13. **동적 에러 페이지**: 에러 상황에 따라 동적으로 내용을 보여주는 에러 페이지.

## 이미지 자료, 구체적인 기능 구현 사항

<details><summary>홈</summary>

![login](/uploads/7c6bce68a1fdb9655c8d7d192913da79/login.gif)
- 배너, 상품 슬라이드 구현(바닐라 자바스크립트)
- 회원가입, 로그인 구현(passport.js, JWT), 유효성 검사
- 헤더에서 현재 장바구니 상태를 보여주는 badge 구현.
</details>


<details><summary>상품 리스트</summary>

![user-info](/uploads/4ed95973a8f13ed4e560999005b0af1d/user-info.gif)
- 카테고리에 따라 분류된 상품 리스트
- 해당 메인 카테고리에 해당하는 소분류 카테고리 버튼 렌더링, 클릭시 해당하는 상품만 렌더링
- 최신순, 오래된순, 가격 높은 순, 가격 낮은 순 정렬 기능
</details>



<details><summary>상품 상세</summary>

![cart](/uploads/6a543e811bb286adba1a370bdd95b4ed/cart.gif)
- 새로고침 없이 수량, 총 금액 렌더링
- 찜하기 기능, 마이페이지에서 확인 가능
- 장바구니 담기 토스트 메시지,
- 바로 구매하기 클릭시 주문 페이지로 바로 이동
</details>


<details><summary>장바구니</summary>

![payment](/uploads/c01cfd477f97b84a8ed334ebd09061aa/payment.gif)
- 비로그인 사용자는 로컬스토래지, 로그인 사용자는 DB에서 장바구니 데이터 관리
- 비로그인 사용자가 로그인 시 로컬스토래지의 데이터가 DB로 병합
- 수량 변경, 삭제, 체크 박스 상태, 총 금액 렌더링 등 새로고침 없는 UI 동작 구현
- 주문하기 또는 바로구매 클릭시(로그인 필요) 로컬 스토래지에 주문 임시 데이터를 저장하고 주문 페이지에서 활용.
</details>


<details><summary>주문</summary>

![user-order](/uploads/94caa9fc7cc571e802e89384b28e04a8/user-order.gif)
- 주문 유효성 검사- 배송지, 전화번호, 동의 사항 체크 필요
- 다음 주소지 검색 api 활용
- 현재 배송정보 저장 체크할 경우 결제시 해당 정보가 사용자 정보로 저장.
- 결제 성공 시 사용자 주문 확인 페이지로 이동
</details>


<details><summary>사용자 페이지</summary>

![filter](/uploads/190890a23ba560a71955a224cdb4c6b0/filter.gif)
- 마이페이지에서 찜한 상품 확인
- 회원 정보 변경 및 회원 탈퇴(비밀번호 인증)기능 구현
- 주문 내역 조회, 주문 건의 배송 상태가 상품 준비중일 경우 배송 취소 버튼 활성화-> 주문 취소 가능
</details>


<details><summary>관리자 - 상품관리</summary>

![admin](/uploads/c21004ee13c57974dbf3652f477214a4/admin.gif)
- 등록된 상품 조회/수정/삭제 기능
- 상품 등록/수정에서 대분류 select를 변경시 해당하는 소분류 카테고리가 렌더링 되도록 구현
- 상품명 검색 기능
</details>
<details><summary>관리자 - 주문관리</summary>

![admin](/uploads/c21004ee13c57974dbf3652f477214a4/admin.gif)
- 등록된 주문 조회/삭제 기능
- 주문 상태별 조회 가능
</details>

<details><summary>관리자 - 카테고리관리</summary>

![admin](/uploads/c21004ee13c57974dbf3652f477214a4/admin.gif)
- 메인 카테고리는 고정, 소분류 카테고리만 등록,수정,삭제 가능.
- 대분류(메인카테고리) 별 카테고리 조회 가능.
</details>

<br />

## 👪 구성원 역할
<br />

| 이름 | 담당 업무 |  
| ------ | ------ |
|  승진   |  BE (팀장)   |
|  경연   |  BE   |
|  성지   |  FE   |
|  윤지   |  FE   |
|  진규   |  FE   |


### 프론트엔드

- **Vanilla javascript**, html, css
- Daum 도로명 주소 api 
- 윤성지
  + 회원가입, 로그인, 주문서 페이지, 사용자 주문조회 페이지 레이아웃
- 이윤지
  + 메인 페이지 , 상품 페이지(서브), 상품 상세 페이지, 관리자 페이지 레이아웃 및 기능 구현 , 반응형 작업, 로고 및 배너 작업
- 김진규
  + 장바구니 페이지, 사용자 정보 페이지, 관리자 주문관리 기능 구현

### 백엔드 

- **Express**
- Mongodb, Mongoose
- 홍승진
  + 상품 정보 api 설계 및 구현, 사용자 인증, 로그인, 회원가입 구현, 배포, 장바구니 DB 연동.
- 김경연
  + 스키마 설계 및 API 구현, JWT token cookie 인증 방식 및 로그인 (임시)


### 폴더 구조
- 프론트: `src/views` 폴더 
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**

### DB 스키마
- ![DB스키마](/uploads/00c948fc6b29a26aba936e110199596a/DB스키마.png)


<br />


## Collaboration Tools
- Padlet : 초반 주제 기획시 의사결정 빠르게 하는 칸반 보드 용도
- Notion : 기능 구현 체크리스트, 회의록, 진행 상황 및 계획
- Discord : 음성 채팅방 활용 의견 제시
- Gitlab : Code Repository
- Gitlab Issue : 진행상황이나 Trouble Shooting 내역
- Postman Teams : API 테스트 진행


## Scrum
- 평일 오전10시 ~ 11시
- YTB(Yesterday, Today, Blocking) 기반 스크럼 회의 진행
  + 어제할일, 오늘할일, 막히는 상황 스크럼 회의때 공유
- 필요시 주말에도 프론트/백엔드 전체 스크럼 진행


---

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2023 엘리스 Inc. All rights reserved.
