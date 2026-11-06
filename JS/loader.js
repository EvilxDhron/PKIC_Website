// Fixed with the help of AI

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
  const MAX_WAIT_TIME = 60000; // 60s safety fallback for slow mobile connections

  const startTime = performance.now();

  let isCancelled = false;
  let isFinishing = false;

  // Prevent background scrolling while loader is active
  document.body.classList.add("pkic-scroll-locked");

  // Collect all images and force them to start downloading immediately
  const images = [...document.images];

  images.forEach((image) => {
    // Support data-src / data-srcset if used in HTML
    if (image.dataset.src && !image.getAttribute("src")) {
      image.src = image.dataset.src;
    }
    if (image.dataset.srcset && !image.getAttribute("srcset")) {
      image.srcset = image.dataset.srcset;
    }

    image.loading = "eager";
  });

  // Wait until the browser finishes loading core page resources
  function waitForWindowLoad() {
    if (document.readyState === "complete") {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      window.addEventListener("load", resolve, { once: true });
    });
  }

  // Wait for a single image to completely download AND decode (with retry for slow networks)
  function waitForSingleImage(image, retries = 2) {
    return new Promise((resolve) => {
      const src = image.currentSrc || image.src;
      if (!src) {
        resolve({ success: true });
        return;
      }

      const decodeAndFinish = async () => {
        try {
          if (typeof image.decode === "function") {
            await image.decode();
          }
          resolve({ success: true });
        } catch {
          // If decode() fails (e.g. certain SVGs) but the image has valid dimensions, it is ready
          if (image.naturalWidth > 0) {
            resolve({ success: true });
          } else {
            retryOrFail();
          }
        }
      };

      const retryOrFail = () => {
        if (retries > 0 && !isCancelled) {
          // Retry loading the image after a brief pause if slow mobile data dropped it
          window.setTimeout(() => {
            const rawSrc = image.getAttribute("src");
            if (rawSrc) {
              const separator = rawSrc.includes("?") ? "&" : "?";
              image.src = `${rawSrc}${separator}retry=${3 - retries}`;
            }
            waitForSingleImage(image, retries - 1).then(resolve);
          }, 600);
        } else {
          resolve({
            success: false,
            source: image.currentSrc || image.src,
          });
        }
      };

      // Check if the image has already finished downloading
      if (image.complete) {
        if (image.naturalWidth > 0) {
          decodeAndFinish();
        } else {
          retryOrFail();
        }
        return;
      }

      // Otherwise, wait specifically for this image's network download to finish
      const onLoad = () => {
        cleanup();
        decodeAndFinish();
      };

      const onError = () => {
        cleanup();
        retryOrFail();
      };

      const cleanup = () => {
        image.removeEventListener("load", onLoad);
        image.removeEventListener("error", onError);
      };

      image.addEventListener("load", onLoad, { once: true });
      image.addEventListener("error", onError, { once: true });
    });
  }

  // Wait for every image on the page
  async function waitForImages() {
    const results = await Promise.all(
      images.map((image) => waitForSingleImage(image)),
    );

    return results.filter((result) => !result.success);
  }

  // Wait for HTML/CSS/JS, fonts, and all images
  async function waitForEverything() {
    await waitForWindowLoad();

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const failedImages = await waitForImages();

    if (failedImages.length) {
      console.warn("Some images could not be loaded:", failedImages);
    }
  }

  // Safety fallback so a permanently broken URL doesn't freeze the site forever
  function waitForMaxTimeout() {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        console.warn("Loader max wait time reached; revealing page.");
        resolve();
      }, MAX_WAIT_TIME);
    });
  }

  // Reveal the website only when everything is ready
  async function finishLoading() {
    if (isFinishing || isCancelled) return;
    isFinishing = true;

    await Promise.race([waitForEverything(), waitForMaxTimeout()]);

    if (isCancelled) return;

    // Ensure minimum display time so the loader doesn't flash too fast
    const elapsed = performance.now() - startTime;
    const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsed);

    if (remainingTime > 0) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, remainingTime);
      });
    }

    if (isCancelled) return;

    // Start fade-out animation and unlock scrolling
    loader.classList.add("is-hidden");
    loaderContent?.classList.add("is-also-hidden");
    loader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pkic-scroll-locked");

    // Remove loader from DOM after transition completes
    window.setTimeout(() => {
      if (!isCancelled) {
        loader.remove();
      }
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
