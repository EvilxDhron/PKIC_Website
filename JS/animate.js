gsap.registerPlugin(ScrollTrigger);

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
