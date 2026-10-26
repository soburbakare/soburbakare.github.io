(function () {
  const $ = (s) => document.querySelector(s),
    root = document.documentElement;
  const views = ["about", "work", "rdprojects", "writings", "presentations", "field"];
  function route(first) {
    let h = (location.hash || "#about").slice(1);
    const sub = h.startsWith("p-");
    if (sub) h = "project";
    if (h === "contact") {
      if (first) h = "about";
      else {
        $("#contact").scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    if (!views.includes(h)) h = "about";
    views.forEach((v) => {
      $("#v-" + v).classList.toggle("on", v === h);
      const a = document.querySelector('nav.tabs a[href="#' + v + '"]');
      a && a.classList.toggle("on", v === h);
    });
    const on = document.querySelector("nav.tabs a.on"),
      nv = $("#tabs");
    if (on && nv.scrollWidth > nv.clientWidth)
      nv.scrollTo({
        left: Math.max(0, on.offsetLeft - 24),
        behavior: "smooth",
      });
    if (sub) {
      const t = document.getElementById(location.hash.slice(1));
      t &&
        setTimeout(
          () => t.scrollIntoView({ behavior: first ? "auto" : "smooth" }),
          40,
        );
    } else if (!first) {
      // every tab opens with the tab bar at the top of the screen (the bar is sticky, so compute its natural position)
      requestAnimationFrame(() => {
        const nv = $("#tabs"),
          prev = nv.previousElementSibling,
          y = prev
            ? prev.getBoundingClientRect().bottom + scrollY + (parseFloat(getComputedStyle(nv).marginTop) || 0)
            : nv.getBoundingClientRect().top + scrollY;
        scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      });
    }
  }
  addEventListener("hashchange", () => route(false));
  route(true);
  document.querySelectorAll(".toc a").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const t = document.getElementById(a.hash.slice(1));
      t && t.scrollIntoView({ behavior: "smooth" });
    }),
  );
  $("#th").onclick = () => {
    const t = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = t;
    try {
      localStorage.setItem("theme", t);
    } catch (e) {}
  };
  $("#y").textContent = new Date().getFullYear();
  if ($("#f")) $("#f").onsubmit = (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    location.href =
      "mailto:bakaresobur@gmail.com?subject=" +
      encodeURIComponent("Message from " + d.get("n")) +
      "&body=" +
      encodeURIComponent(
        d.get("m") + "\n\n" + d.get("n") + " <" + d.get("e") + ">",
      );
  };
  // ON THE JOB gallery: click a photo to view it in a fixed-size pop-up (Esc closes, arrow keys move between photos)
  (function () {
    const links = [...document.querySelectorAll(".album a.lb")];
    if (!links.length) return;
    const box = document.createElement("div");
    box.className = "lbx";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<div class="fr"><div class="stg"><img alt=""></div><p class="cp"></p><button type="button" class="x" aria-label="Close">\u00d7</button><button type="button" class="pv" aria-label="Previous photo">\u2039</button><button type="button" class="nx" aria-label="Next photo">\u203a</button></div>';
    document.body.appendChild(box);
    const im = box.querySelector("img"),
      cp = box.querySelector(".cp"),
      bx = box.querySelector(".x"),
      bp = box.querySelector(".pv"),
      bn = box.querySelector(".nx");
    let i = 0,
      opener = null;
    function show(n) {
      i = (n + links.length) % links.length;
      const a = links[i],
        t = a.querySelector("img"),
        f = a.closest("figure").querySelector("figcaption");
      im.src = a.getAttribute("href");
      im.alt = t ? t.alt : "";
      cp.textContent =
        (f ? f.textContent + "  " : "") +
        "(" +
        (i + 1) +
        " / " +
        links.length +
        ")";
    }
    function open(n, o) {
      opener = o;
      show(n);
      box.classList.add("on");
      document.body.style.overflow = "hidden";
      bx.focus();
    }
    function close() {
      box.classList.remove("on");
      document.body.style.overflow = "";
      if (opener) opener.focus();
    }
    links.forEach((a, n) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        open(n, a);
      }),
    );
    bx.onclick = close;
    bp.onclick = () => show(i - 1);
    bn.onclick = () => show(i + 1);
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("on")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(i - 1);
      else if (e.key === "ArrowRight") show(i + 1);
      else if (e.key === "Tab") {
        const f = [bx, bp, bn],
          k = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(k + (e.shiftKey ? -1 : 1) + 3) % 3].focus();
      }
    });
  })();
  // ---- gentle motion: scroll progress, reveal-on-scroll, theme-button turn ----
  (function () {
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bar = $(".prog");
    if (bar && !calm) {
      let tick = false;
      const upd = () => {
        const h = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
        tick = false;
      };
      addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
      addEventListener("resize", upd);
      upd();
    }
    const th = $("#th");
    if (th && !calm) {
      let r = 0;
      th.addEventListener("click", () => { r += 180; th.style.transform = "rotate(" + r + "deg)"; });
    }
    const els = [...document.querySelectorAll(".view .rows > div, .view .job, .view .wr, .view .pres > *, .view .meta > div, .view h2")];
    if (calm || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el, n) => {
      const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.transitionDelay = Math.min(sib, 5) * 70 + "ms";
      el.classList.add("rv");
      io.observe(el);
    });
  })();
  // graceful fallback if an image file is missing: show a labelled box instead of a broken-image icon
  function miss(i) {
    if (i.dataset.m) return;
    i.dataset.m = 1;
    const d = document.createElement("div");
    d.className = "ph-box";
    d.setAttribute("role", "img");
    d.setAttribute("aria-label", i.alt);
    d.textContent = "Image to be added: " + (i.alt || i.getAttribute("src"));
    i.replaceWith(d);
  }
  document.querySelectorAll("img").forEach((i) => {
    i.addEventListener("error", () => miss(i));
    if (i.complete && i.naturalWidth === 0 && i.getAttribute("src")) miss(i);
  });
})();
