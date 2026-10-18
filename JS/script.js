"use strict";

const sidebar = document.querySelector(".sidebar");
const sidebarBackdrop = document.querySelector(".sidebar__backdrop");
const hamBtn = document.querySelector(".hamburger__btn");
const sidebarCloseBtn = document.querySelector(".sidebar__close-btn");

const handleSidebar = () => {
  sidebar.classList.toggle("sidebar__hide");
  sidebarBackdrop.classList.toggle("backdrop__hide");
};

hamBtn.addEventListener("click", handleSidebar);

sidebarCloseBtn.addEventListener("click", handleSidebar);

sidebarBackdrop.addEventListener("click", handleSidebar);
