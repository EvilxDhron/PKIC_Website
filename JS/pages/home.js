"use strict";

import "../animate.js";
import "../main.js";

// loader
const loader = document.querySelector("#pkic-loader");

// hero headings
const eyebrow = document.querySelectorAll(".eyebrow");
const heading = document.querySelector(".hero__heading");
heading.style.opacity = 0;
const subheading = document.querySelector(".hero__subheading");
subheading.style.opacity = 0;

// Statistics
const statisticsSection = document.querySelector(".statistics");
const allStats = document.querySelectorAll(".stat__num");

/* All Card elements */
const facilityCards = document.querySelectorAll(".facility");
const noticeCards = document.querySelectorAll(".notice__card");

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
