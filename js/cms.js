/* Wasil GreenHer Foundation — Sanity CMS loader.
   Pulls hero slides, insight posts, gallery items and events from Sanity
   (content managed visually in Sanity Studio — see SANITY-SETUP.md).
   If Sanity is not configured or unreachable, the static content in the
   HTML stays as-is, so the site never looks broken. */

(function () {
  var cfg = window.WGF_SANITY;
  if (!cfg || !cfg.projectId || cfg.projectId === "YOUR_PROJECT_ID") return;

  function query(groq) {
    var url = "https://" + cfg.projectId + ".apicdn.sanity.io/v2025-01-01/data/query/" +
      cfg.dataset + "?query=" + encodeURIComponent(groq);
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) { return d.result || []; })
      .catch(function () { return []; });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function initials(name) {
    return String(name || "").trim().split(/\s+/).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  // ---------- Homepage "Who We Are" photo (editable in Sanity) ----------
  var whoImg = document.getElementById("home-whoweare-img");
  if (whoImg) {
    query('*[_type == "siteSettings"][0]{"who": whoWeAreImage.asset->url}')
      .then(function (s) {
        if (s && s.who) whoImg.src = s.who + "?w=1100&auto=format";
      });
  }

  // ---------- Team members (About page, Sanity-driven) ----------
  var teamGrid = document.getElementById("team-grid");
  if (teamGrid) {
    query('*[_type == "teamMember"] | order(order asc, _createdAt asc){name, role, bio, "img": photo.asset->url}')
      .then(function (members) {
        if (!members.length) return; // keep the static fallback card
        teamGrid.innerHTML = members.map(function (m) {
          var avatar = m.img
            ? '<div class="team-avatar"><img src="' + esc(m.img) + '?w=300&h=300&fit=crop&crop=focalpoint&auto=format" alt="' + esc(m.name) + '"></div>'
            : '<div class="team-avatar">' + esc(initials(m.name)) + "</div>";
          return '<div class="team-card">' + avatar +
            "<h3>" + esc(m.name) + "</h3>" +
            (m.role ? '<div class="team-role">' + esc(m.role) + "</div>" : "") +
            (m.bio ? "<p>" + esc(m.bio) + "</p>" : "") +
            "</div>";
        }).join("");
      });
  }

  // ---------- Hero slideshow (homepage) ----------
  var heroWrap = document.querySelector(".hero-slides");
  if (heroWrap) {
    query('*[_type == "heroSlide"] | order(order asc) {"img": image.asset->url, "video": video.asset->url}')
      .then(function (slides) {
        if (!slides.length) return;
        heroWrap.innerHTML = slides.map(function (s) {
          if (s.video) {
            return '<video class="slide" src="' + esc(s.video) + '" muted loop playsinline preload="metadata"></video>';
          }
          if (s.img) {
            return '<div class="slide" style="background-image:url(\'' + esc(s.img) + '?w=1800&auto=format\')"></div>';
          }
          return "";
        }).join("");
        if (window.WGFSlideshow) window.WGFSlideshow.restart();
      });
  }

  // ---------- Insight posts ----------
  var postQuery = '*[_type == "post"] | order(publishedAt desc) {title, category, excerpt, publishedAt, "img": image.asset->url}';

  function postCard(p) {
    var thumb = p.img
      ? '<div class="thumb"><img src="' + esc(p.img) + '?w=800&auto=format" alt="' + esc(p.title) + '"></div>'
      : "";
    return '<article class="card post-card">' + thumb +
      '<div class="body">' +
      '<span class="post-meta">' + esc(p.category || "News") +
      (p.publishedAt ? " · " + fmtDate(p.publishedAt) : "") + "</span>" +
      "<h3>" + esc(p.title) + "</h3>" +
      "<p>" + esc(p.excerpt) + "</p>" +
      "</div></article>";
  }

  var insightGrid = document.getElementById("insight-grid");
  if (insightGrid) {
    query(postQuery).then(function (posts) {
      if (posts.length) insightGrid.innerHTML = posts.map(postCard).join("");
    });
  }

  var homeInsight = document.getElementById("home-insight");
  if (homeInsight) {
    query(postQuery + "[0...3]").then(function (posts) {
      if (posts.length) homeInsight.innerHTML = posts.map(postCard).join("");
    });
  }

  // ---------- Gallery ----------
  var galleryGrid = document.getElementById("gallery-grid");
  if (galleryGrid) {
    query('*[_type == "galleryItem"] | order(_createdAt desc) {caption, "img": image.asset->url, "video": video.asset->url}')
      .then(function (items) {
        if (!items.length) return;
        galleryGrid.innerHTML = items.map(function (it) {
          var media = it.video
            ? '<video src="' + esc(it.video) + '" controls muted playsinline style="width:100%;height:280px;object-fit:cover;"></video>'
            : '<img src="' + esc(it.img) + '?w=900&auto=format" alt="' + esc(it.caption) + '">';
          return '<figure class="gallery-item">' + media +
            "<figcaption>" + esc(it.caption) + "</figcaption></figure>";
        }).join("");
      });
  }

  // ---------- Events ----------
  var eventsList = document.getElementById("events-list");
  if (eventsList) {
    query('*[_type == "event"] | order(coalesce(date, "9999-12-31") asc) {title, category, location, timeInfo, date, description}')
      .then(function (events) {
        if (!events.length) return;
        eventsList.innerHTML = events.map(function (ev) {
          var d = ev.date ? new Date(ev.date) : null;
          var day = d ? d.getDate() : "–";
          var month = d ? d.toLocaleDateString("en-GB", { month: "short" }) : "TBA";
          return '<div class="card event-card">' +
            '<div class="event-date"><div class="day">' + day + '</div><div class="month">' + esc(month) + "</div></div>" +
            "<div>" +
            '<span class="badge green">' + esc(ev.category || "Event") + "</span>" +
            "<h3>" + esc(ev.title) + "</h3>" +
            '<p class="event-meta">📍 ' + esc(ev.location || "To be announced") +
            " · 🕘 " + esc(ev.timeInfo || (d ? fmtDate(ev.date) : "Date to be announced")) + "</p>" +
            "<p>" + esc(ev.description) + "</p>" +
            '<a class="btn btn-outline" href="#register" style="margin-top:14px;">Register</a>' +
            "</div></div>";
        }).join("");

        // Keep the registration form's event dropdown in sync
        var select = document.getElementById("ev-event");
        if (select) {
          select.innerHTML = '<option value="">Select an event…</option>' +
            events.map(function (ev) { return "<option>" + esc(ev.title) + "</option>"; }).join("") +
            "<option>Other / future events</option>";
        }
      });
  }
})();
