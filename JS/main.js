"use strict";

import "./animate.js";
import "./loader.js";

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

const sidebarBackdrop = document.querySelector(".sidebar__backdrop");

/* All Card elements */
const facilityCards = document.querySelectorAll(".facility");
const noticeCards = document.querySelectorAll(".notice__card");

async function loadComponents() {
  const components = document.querySelectorAll("[data-include]");

  await Promise.all(
    [...components].map(async (element) => {
      const response = await fetch(element.dataset.include);

      if (!response.ok) {
        throw new Error(`Failed to load: ${element.dataset.include}`);
      }

      element.innerHTML = await response.text();
    }),
  );
}

function initNavbar() {
  const sidebar = document.querySelector(".sidebar");
  const sidebarBackdrop = document.querySelector(".sidebar__backdrop");
  const hamBtn = document.querySelector(".hamburger__btn");
  const sidebarCloseBtn = document.querySelector(".sidebar__close-btn");

  if (!sidebar || !sidebarBackdrop || !hamBtn || !sidebarCloseBtn) return;

  const openSidebar = () => {
    sidebar.classList.remove("sidebar__hide");
    sidebarBackdrop.classList.remove("backdrop__hide");
  };

  const closeSidebar = () => {
    sidebar.classList.add("sidebar__hide");
    sidebarBackdrop.classList.add("backdrop__hide");
  };

  hamBtn.addEventListener("click", openSidebar);
  sidebarCloseBtn.addEventListener("click", closeSidebar);
  sidebarBackdrop.addEventListener("click", closeSidebar);

  sidebar.addEventListener("click", (event) => {
    event.preventDefault();
    const link = event.target.closest(".sidebar__link");

    if (!link) return;

    let href = link.getAttribute("href");
    href = href.slice(href.indexOf("#"));

    // Allow navigation to other pages normally.
    if (!href || !href.startsWith("#")) return;

    const section = document.querySelector(href);

    if (!section) return;

    event.preventDefault();

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    closeSidebar();

    window.addEventListener(
      "scroll",
      () => {
        document
          .querySelector(".active--photo")
          ?.classList.remove("active--photo");
        closeSidebar();
      },
      { passive: true },
    );
  });
}

function initGallery() {
  // gallery
  const gallery = document.querySelector(".schoollife__gallery");
  const sidebarBackdrop = document.querySelector(".sidebar__backdrop");

  if (!gallery || !sidebarBackdrop) return;

  const removeActivePhoto = () => {
    gallery.querySelector(".active--photo")?.classList.remove("active--photo");
    gallery
      .querySelector(".active--caption")
      ?.classList.remove("active--caption");
  };

  const showPhoto = (event) => {
    const photo = event.target.closest(".gallery__photo");
    removeActivePhoto();
    if (photo) {
      photo.classList.add("active--photo");
      sidebarBackdrop.classList.remove("backdrop__hide");
    }
  };

  gallery.addEventListener("click", showPhoto);
  sidebarBackdrop.addEventListener("click", removeActivePhoto);
}

async function init() {
  try {
    await loadComponents();
    initNavbar();
    initGallery();
  } catch (error) {
    console.error("Website initialization failed:", error);
  }
}

init();

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
animateCards(facilityCards);
animateCards(noticeCards);

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
