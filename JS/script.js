"use strict";

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

hamBtn.addEventListener("click", handleSidebar);

sidebarCloseBtn.addEventListener("click", handleSidebar);

sidebarBackdrop.addEventListener("click", handleSidebar);

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

sidebar.addEventListener("click", goToSection(event));
