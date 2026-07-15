/* Wasil GreenHer Foundation — shared site behaviour */

document.addEventListener("DOMContentLoaded", function () {
  // ----- Mobile navigation toggle -----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
  }

  // ----- Mark the current page link as active -----
  // Sub-pages highlight their parent tab (gallery→Insight, events→Programmes).
  var page = location.pathname.split("/").pop() || "index.html";
  var parentOf = { "gallery.html": "insight.html", "events.html": "programmes.html" };
  var target = parentOf[page] || page;
  document.querySelectorAll(".main-nav a").forEach(function (a) {
    if (a.getAttribute("href") === target) a.classList.add("active");
  });

  // ----- Graceful fallback for photos that are not uploaded yet -----
  function hideBroken(img) {
    var holder = img.closest(".thumb, .gallery-item, .hero-photo, .split-photo, .team-photo");
    if (holder) {
      img.remove();
      holder.classList.add("img-missing");
    } else {
      img.style.display = "none";
    }
  }
  document.querySelectorAll("img").forEach(function (img) {
    // The error event may have already fired before this script ran
    // (common when pages load from disk), so also check the current state.
    if (img.complete && img.naturalWidth === 0) {
      hideBroken(img);
    } else {
      img.addEventListener("error", function () { hideBroken(img); });
    }
  });
  // Hide image slides whose background photo is missing (before upload).
  document.querySelectorAll(".hero-slides .slide[style]").forEach(function (slide) {
    var m = /url\(['"]?([^'")]+)['"]?\)/.exec(slide.style.backgroundImage);
    if (!m) return;
    var probe = new Image();
    probe.onerror = function () { slide.remove(); };
    probe.src = m[1];
  });

  // ----- Forms: local demo handling until a form backend is connected -----
  // To make forms send real submissions: create a free form at https://formspree.io,
  // then set the form's `action` attribute to your Formspree endpoint and remove
  // the `data-demo` attribute. Netlify users can instead add `data-netlify="true"`.
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var success = form.querySelector(".form-success");
      function finish() {
        if (success) {
          success.classList.add("show");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
      }
      if (form.hasAttribute("data-netlify")) {
        // On Netlify, submit via AJAX so the inline thank-you still shows.
        // Locally the POST 404s — we catch it and show the message anyway.
        var body = new URLSearchParams(new FormData(form)).toString();
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
          .then(finish)
          .catch(finish);
      } else {
        finish();
      }
    });
  });

  // ----- Gallery lightbox (delegated, so it also works for CMS-loaded items) -----
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lb-caption");
    document.addEventListener("click", function (e) {
      var item = e.target.closest(".gallery-item");
      if (!item) return;
      var img = item.querySelector("img");
      if (!img) return; // video items play inline instead
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
      lightbox.classList.add("open");
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target !== lbImg) lightbox.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lightbox.classList.remove("open");
    });
  }

  // ----- Footer year -----
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ----- Hero background slideshow -----
  startSlideshow();
});

// Cycles the children of .hero-slides (image divs or <video> elements).
// Exposed globally so cms.js can restart it after replacing the slides.
function startSlideshow() {
  var wrap = document.querySelector(".hero-slides");
  if (!wrap) return;
  if (wrap.dataset.timer) {
    clearInterval(Number(wrap.dataset.timer));
    delete wrap.dataset.timer;
  }
  var slides = Array.prototype.slice.call(wrap.querySelectorAll(".slide"));
  if (!slides.length) return;
  var i = 0;
  function show(n) {
    slides.forEach(function (s, idx) {
      var on = idx === n;
      s.classList.toggle("active", on);
      if (s.tagName === "VIDEO") {
        if (on) { s.muted = true; s.currentTime = 0; s.play().catch(function () {}); }
        else { s.pause(); }
      }
    });
  }
  show(0);
  if (slides.length > 1) {
    wrap.dataset.timer = String(setInterval(function () {
      i = (i + 1) % slides.length;
      show(i);
    }, 6000));
  }
}
window.WGFSlideshow = { restart: startSlideshow };
