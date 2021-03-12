import gsap from "gsap";
import MorphSVGPlugin from "../vendor/gsap/MorphSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin);

class Menu {
  constructor(el) {
    this.menuButton = el;
    this.isOpen = false;
    this.timeline = gsap.timeline({ paused: true });
    this.menuNav = document.querySelector(".menu__nav");
    this.events();
    this.init();
  }

  init() {
    gsap.set(".menu__item", { y: "100%" });

    this.timeline
      .to("#menu--icon", {
        duration: 0.85,
        morphSVG: "#close--icon",
        ease: "expo.inOut",
      })
      .to(
        ".menu__background",
        {
          height: "100%",
          duration: 1.5,
          ease: "expo.inOut",
        },
        0.15
      )
      .to(
        ".menu__item",
        {
          y: "0%",
          duration: 1.2,
          ease: "Power4.easeOut",
          stagger: 0.15,
        },
        1
      );
  }

  events() {
    this.menuButton.addEventListener("click", this.toggleButton.bind(this));
  }

  toggleButton() {
    if (this.isOpen) {
      this.isOpen = false;
      this.timeline.reverse();
      this.menuNav.style.pointerEvents = "none";
    } else {
      this.isOpen = true;
      this.timeline.play();
      this.menuNav.style.pointerEvents = "auto";
    }
  }
}

export default Menu;
