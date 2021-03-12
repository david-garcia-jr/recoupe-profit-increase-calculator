class Header {
  constructor(el) {
    this.header = el;
    this.init();
  }

  init() {
    console.log("Header");
  }

  hide() {
    this.header.classList.remove("header--dark");
  }

  show() {
    this.header.classList.add("header--dark");
  }

  events() {}
}

export default Header;
