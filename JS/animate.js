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
