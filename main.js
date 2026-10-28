// Scroll reveals, dimension lines, sticky nav border, theme toggle, image viewer.
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

  // Light/dark toggle. Follows the device until the visitor picks one, then remembers it.
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const deviceDark = window.matchMedia("(prefers-color-scheme: dark)");
  const current = () => root.dataset.theme || (deviceDark.matches ? "dark" : "light");
  const sync = () => {
    const label = current() === "dark" ? "Switch to light theme" : "Switch to dark theme";
    toggle.dataset.state = current();
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
  };
  sync();
  deviceDark.addEventListener("change", sync);
  toggle.addEventListener("click", () => {
    root.dataset.theme = current() === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    sync();
  });

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
