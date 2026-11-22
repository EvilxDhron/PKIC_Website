"use strict";

gsap.registerPlugin(ScrollTrigger);

// loader
const loader = document.querySelector("#pkic-loader");

// Hero Headings
const contactTitle = document.querySelector("#contact--hero__title");
const contactIntro = document.querySelector(".headings__intro");

// Form Inputs
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");

// Allow only letters, spaces, apostrophes and hyphens in names
nameInput.addEventListener("input", () => {
  nameInput.value = nameInput.value.replace(/[^\p{L}\p{M} '\-]/gu, "");
});

// Allow only 10 digits in mobile number
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
});

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
