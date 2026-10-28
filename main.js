// Scroll reveals, dimension lines, sticky nav border, image viewer.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal blocks and draw dimension lines as they enter the viewport.
  const targets = document.querySelectorAll(".reveal, [data-dim]");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add(el.hasAttribute("data-dim") ? "drawn" : "in"));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add(el.hasAttribute("data-dim") ? "drawn" : "in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    targets.forEach(el => io.observe(el));
  }

  // Hairline under the nav once the page scrolls.
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Image viewer.
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  let lastFocus = null;
  const close = () => {
    lb.classList.remove("open");
    if (lastFocus) lastFocus.focus();
  };
  document.querySelectorAll("[data-lightbox]").forEach(a => {
    a.addEventListener("click", ev => {
      ev.preventDefault();
      lastFocus = a;
      const img = a.querySelector("img");
      lbImg.src = a.getAttribute("href");
      lbImg.alt = img ? img.alt : "";
      lb.classList.add("open");
      document.getElementById("lb-close").focus();
    });
  });
  lb.addEventListener("click", ev => { if (ev.target !== lbImg) close(); });
  document.addEventListener("keydown", ev => { if (ev.key === "Escape" && lb.classList.contains("open")) close(); });
})();
