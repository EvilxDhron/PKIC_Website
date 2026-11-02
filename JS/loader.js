(() => {
  const loader = document.querySelector("#pkic-loader");
  const loaderContent = document.querySelector(".pkic-loader__content");

  if (!loader) return;

  // Mobile only
  const mobileView = window.matchMedia("(max-width: 767px)");

  if (!mobileView.matches) {
    loader.remove();
    return;
  }

  const MINIMUM_DISPLAY_TIME = 800;
  const TRANSITION_TIME = 1600;

  const startTime = performance.now();

  let isCancelled = false;
  let isFinishing = false;

  // Collect all images currently present in the HTML
  const images = [...document.images];

  // Force lazy images to load before revealing the website.
  // Note: This disables lazy loading for these images.
  images.forEach((image) => {
    image.loading = "eager";
  });

  // Prevent background scrolling
  document.body.classList.add("pkic-scroll-locked");

  // Wait until the browser finishes loading page resources
  function waitForWindowLoad() {
    if (document.readyState === "complete") {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      window.addEventListener("load", resolve, {
        once: true,
      });
    });
  }

  // Wait for every image to finish decoding
  async function waitForImages() {
    const results = await Promise.all(
      images.map(async (image) => {
        if (!image.currentSrc && !image.src) {
          return { success: true };
        }

        try {
          await image.decode();

          return { success: true };
        } catch {
          return {
            success: false,
            source: image.currentSrc || image.src,
          };
        }
      }),
    );

    return results.filter((result) => !result.success);
  }

  // Wait for all required resources
  async function waitForEverything() {
    // 1. HTML, CSS, JS and eager-loaded resources
    await waitForWindowLoad();

    // 2. Fonts and completed layout
    await document.fonts.ready;

    // 3. Image downloading and decoding
    const failedImages = await waitForImages();

    if (failedImages.length) {
      console.warn("Some images could not be loaded:", failedImages);
    }
  }

  // Reveal the website when everything is ready
  async function finishLoading() {
    if (isFinishing || isCancelled) return;

    await waitForEverything();

    if (isCancelled) return;

    isFinishing = true;

    // Avoid a loader that disappears too quickly
    const elapsed = performance.now() - startTime;

    const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsed);

    await new Promise((resolve) => {
      window.setTimeout(resolve, remainingTime);
    });

    if (isCancelled) return;

    // Start the fade-out animation
    loader.classList.add("is-hidden");
    loaderContent.classList.add("is-also-hidden");
    loader.setAttribute("aria-hidden", "true");

    // Remove loader after transition completes
    window.setTimeout(() => {
      loader.remove();

      document.body.classList.remove("pkic-scroll-locked");
    }, TRANSITION_TIME);
  }

  // Handle mobile-to-desktop resizing
  mobileView.addEventListener("change", (event) => {
    if (!event.matches) {
      isCancelled = true;

      loader.remove();

      document.body.classList.remove("pkic-scroll-locked");
    }
  });

  finishLoading();
})();
