gsap.registerPlugin(ScrollTrigger);

const allP = document.querySelectorAll("blockquote p");

allP.forEach((sentence) => {
  let clutter = "";
  sentence.innerText.split("").forEach((char) => {
    clutter += `<span>${char}</span>`;
  });
  sentence.innerHTML = clutter;
});

const tlCards = gsap.timeline({
  scrollTrigger: {
    trigger: ".section__choose",
    scroller: "body",
    scrub: 2,
    start: "top 60%",
    end: "top 10%",
  },
});

tlCards.from(".why-card", {
  x: (i) => (i % 2 === 0 ? 200 : -200),
  opacity: 0,
  stagger: 0.3,
});

gsap.from(".acad__card", {
  y: 300,
  opacity: 0,
  stagger: 0.7,
  scrollTrigger: {
    trigger: ".section__academics",
    scroller: "body",
    scrub: 2,
    start: "top 10%",
    end: "top -200%",
    pin: true,
  },
});

gsap.from("blockquote p span", {
  color: "#ffffff46",
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".section__message",
    scroller: "body",
    scrub: 1.5,
    start: "top 60%",
    end: "top 30%",
  },
});

gsap.utils.toArray(".headings__kicker").forEach((kicker) => {
  gsap.from(kicker, {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "bounce.out",
    scrollTrigger: {
      trigger: kicker,
      start: "top 50%",
      toggleActions: "restart none none reverse",
    },
  });
});
