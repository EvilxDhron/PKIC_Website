"use strict";

// import "./animate.js";
import "./loader.js";

const eyebrow = document.querySelectorAll(".eyebrow");

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

  window.addEventListener(
    "scroll",
    () => {
      closeSidebar();
    },
    { passive: true },
  );

  sidebar.addEventListener("click", (event) => {
    const link = event.target.closest(".sidebar__link");

    if (!link) return;
    if (
      link.textContent.includes("Home") ||
      link.textContent.includes("Contact")
    )
      return;

    event.preventDefault();

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
  });
}

// Home Page Gallery
function initGallery() {
  const gallery = document.querySelector(".schoollife__gallery");
  const sidebarBackdrop = document.querySelector(".sidebar__backdrop");
  const sidebar = document.querySelector(".sidebar");

  if (!gallery || !sidebarBackdrop || !sidebar) return;

  const closeSidebar = () => {
    sidebar.classList.add("sidebar__hide");
    sidebarBackdrop.classList.add("backdrop__hide");
  };

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
