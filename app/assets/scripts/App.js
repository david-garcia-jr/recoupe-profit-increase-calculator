import "../styles/styles.css";
import $ from "jquery";
import debounce from "lodash/debounce";
import Header from "./modules/Header";
import Menu from "./modules/Menu";
import Calculator from "./modules/Calculator";
require("../../../node_modules/bootstrap/dist/js/bootstrap.bundle");

document.addEventListener("DOMContentLoaded", () => {
  const header = new Header(document.querySelector(".header"));
  const menu = new Menu(document.querySelector(".menu__button"));
  const calculator = new Calculator();
  $("[data-toggle='tooltip']").tooltip();
});

if (module.hot) {
  module.hot.accept();
}
