"use strict";

gsap.registerPlugin(ScrollTrigger);

// loader
const loader = document.querySelector("#pkic-loader");

// Hero Headings
const contactTitle = document.querySelector("#contact--hero__title");
const contactIntro = document.querySelector(".headings__intro");

const loaderObserver = new IntersectionObserver(animateHero, {
  root: null,
  threshold: 0,
});

loaderObserver.observe(loader);

function animateHero(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) return;
    gsap.to("#contact--hero__kicker", {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "bounce.out",
    });

    contactTitle.innerHTML = contactTitle.innerHTML.replace(
      "Contact Us",
      `<span class="heading-line"><span class="line-inner">Contact Us</span></span>`,
    );

    contactTitle.style.opacity = 1;
    contactIntro.classList.add("subtitle");

    observer.unobserve(loader);
  });
}
