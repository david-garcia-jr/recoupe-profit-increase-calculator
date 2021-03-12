import LocomotiveScroll from "locomotive-scroll";

class SmoothScroll {
  constructor(el) {
    this.scrollContainer = el;
    this.init();
  }

  init() {
    console.log("SmoothScroll");
    this.scroller = new LocomotiveScroll({
      el: this.scrollContainer,
      smooth: true,
      touchMultiplier: 3,
      firefoxMultiplier: 3,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });
    window.scroller = this.scroller;
  }

  getScroller() {
    return this.scroller;
  }
}

export default SmoothScroll;
