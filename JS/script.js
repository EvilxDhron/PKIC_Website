"use strict";

// Locomotive JS
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("body"),
  smooth: true,
});

// loader
const loader = document.querySelector("#pkic-loader");

// hero headings
const eyebrow = document.querySelectorAll(".eyebrow");
const heading = document.querySelector(".hero__heading");
heading.style.opacity = 0;
const subheading = document.querySelector(".hero__subheading");
subheading.style.opacity = 0;

// All icons
const allIcons = document.querySelectorAll(".icon");

// Statistics
const statisticsSection = document.querySelector(".statistics");
const allStats = document.querySelectorAll(".stat__num");

/* Sidebar elements */

const sidebar = document.querySelector(".sidebar");
const sidebarBackdrop = document.querySelector(".sidebar__backdrop");
const hamBtn = document.querySelector(".hamburger__btn");
const sidebarCloseBtn = document.querySelector(".sidebar__close-btn");

/* All Card elements */

const cards = document.querySelectorAll(".acad__card");
const whyCards = document.querySelectorAll(".why-card");
const facilityCards = document.querySelectorAll(".facility");
const noticeCards = document.querySelectorAll(".notice__card");

const gallery = document.querySelector(".schoollife__gallery");

const animateStats = (elem, times) => {
  let timer;
  let counter = 0;
  return (timer = setInterval(() => {
    elem.innerText = `${counter}+`;
    counter++;
    if (counter > times) {
      clearTimeout(timer);
    }
  }, 10));
};

const animateHero = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) return;
    heading.innerHTML = heading.innerHTML
      .replace(
        "Where every child",
        '<span class="heading-line"><span class="line-inner">Where every child</span></span>',
      )
      .replace(
        "learns to lead with",
        '<span class="heading-line"><span class="line-inner">learns to lead with</span></span>',
      )
      .replace(
        '<span class="hero__highlighted">confidence</span>',
        '<span class="heading-line"><span class="line-inner"><span class="hero__highlighted">confidence</span></span></span>',
      );

    heading.style.opacity = 1;
    subheading.classList.add("subtitle");
    subheading.style.opacity = 1;

    observer.unobserve(loader);
  });
};

const handleStats = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    allStats.forEach((stat) => {
      animateStats(stat, parseInt(stat.innerText));
    });
    observer.unobserve(statisticsSection);
  });
};

const loaderObserver = new IntersectionObserver(animateHero, {
  root: null,
  threshold: 0,
});

const statsObserver = new IntersectionObserver(handleStats, {
  root: null,
  threshold: 0.9,
});

loaderObserver.observe(loader);
statsObserver.observe(statisticsSection);

const handleCards = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("animate__card");
    observer.unobserve(entry.target);
  });
};

const cardObserver = new IntersectionObserver(handleCards, {
  threshold: 0.1,
});

const animateCards = (cards) => {
  cards.forEach((card) => {
    card.classList.add("animate__card");
    cardObserver.observe(card);
  });
};
animateCards(cards);
animateCards(whyCards);
animateCards(facilityCards);
animateCards(noticeCards);

const handleSidebar = () => {
  sidebar.classList.toggle("sidebar__hide");
  sidebarBackdrop.classList.toggle("backdrop__hide");
};

const handleBackdrop = () => {
  sidebar.classList.add("sidebar__hide");
  sidebarBackdrop.classList.add("backdrop__hide");
  document.querySelector(".active--photo")?.classList.remove("active--photo");
};

const goToSection = (event) => {
  return (event) => {
    event.preventDefault();
    const link = event.target.closest(".sidebar__link");
    if (!link) return;
    const section = document.querySelector(`${link.getAttribute("href")}`);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    handleSidebar();
  };
};

const removeActivePhoto = () => {
  gallery.querySelector(".active--photo")?.classList.remove("active--photo");
  gallery
    .querySelector(".active--caption")
    ?.classList.remove("active--caption");
};

const showPhoto = (event) => {
  return (event) => {
    const photo = event.target.closest(".gallery__photo");
    removeActivePhoto();
    if (photo) {
      photo.classList.add("active--photo");
      sidebarBackdrop.classList.remove("backdrop__hide");
    }
  };
};

const handleIcons = (event, elem) => {
  return () => {
    elem.classList.add("animate__animated", "animate__rubberBand");
    setTimeout(() => {
      elem.classList.remove("animate__animated", "animate__rubberBand");
    }, 1000);
  };
};

const handleEyebrow = (event, elem) => {
  return () => {
    elem.classList.add("animate__animated", "animate__hinge");
    setTimeout(() => {
      elem.classList.remove("animate__animated", "animate__hinge");
    }, 3000);
  };
};

eyebrow.forEach((elem) => {
  elem.addEventListener("click", handleEyebrow(event, elem));
});

allIcons.forEach((elem) => {
  elem.addEventListener("click", handleIcons(event, elem));
});

hamBtn.addEventListener("click", handleSidebar);

sidebarCloseBtn.addEventListener("click", handleSidebar);

sidebarBackdrop.addEventListener("click", handleBackdrop);

sidebar.addEventListener("click", goToSection(event));

gallery.addEventListener("click", showPhoto(event));

window.addEventListener(
  "scroll",
  () => {
    document.querySelector(".active--photo")?.classList.remove("active--photo");
    handleBackdrop();
  },
  { passive: true },
);
