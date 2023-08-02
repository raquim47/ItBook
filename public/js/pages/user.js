import setupHeader from "../components/header.js";
import renderScrollTopBtn from "../components/scroll-top-btn.js";
import authService from "../services/auth-service.js";
import cartService from "../services/cart-service.js";

const initPage = async () => {
  await authService.initializeAuth();
  await cartService.initializeCart();

  setupHeader();
  renderScrollTopBtn();
}

initPage();