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

  // ---------- Contact details & social links (footer of every page) ----------
  // "0907 297 0381" -> "+2349072970381" so the number stays readable on the
  // page while the tap-to-call link still works from any country.
  function telHref(phone) {
    var digits = String(phone || "").replace(/[^\d+]/g, "");
    if (!digits) return "";
    if (digits.charAt(0) === "+") return digits;
    if (digits.charAt(0) === "0") return "+234" + digits.slice(1);
    return digits;
  }

  var SOCIAL_GLYPHS = [
    {key: "facebook", label: "Facebook", glyph: "f"},
    {key: "instagram", label: "Instagram", glyph: "◎"},
    {key: "x", label: "X (Twitter)", glyph: "𝕏"},
    {key: "linkedin", label: "LinkedIn", glyph: "in"},
    {key: "youtube", label: "YouTube", glyph: "▶"},
    {key: "tiktok", label: "TikTok", glyph: "♪"}
  ];

  query('*[_type == "contactInfo"][0]{email, phone, officeLocation, facebook, instagram, x, linkedin, youtube, tiktok}')
    .then(function (c) {
      if (!c) return; // no document yet — keep whatever is in the HTML

      var mail = c.email ? '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>" : "";
      var tel = c.phone ? '<a href="tel:' + esc(telHref(c.phone)) + '">' + esc(c.phone) + "</a>" : "";

      // Footer line: "Abuja (FCT), Nigeria · email · phone" — skip empty parts
      // so we never render a stray separator.
      var footerLine = [esc(c.officeLocation || ""), mail, tel].filter(Boolean).join(" · ");
      if (footerLine) {
        Array.prototype.forEach.call(document.querySelectorAll(".footer-contact"), function (el) {
          el.innerHTML = footerLine;
        });
      }

      // Contact page details.
      var loc = document.getElementById("contact-location");
      if (loc && c.officeLocation) loc.textContent = c.officeLocation;
      var em = document.getElementById("contact-email");
      if (em && mail) em.innerHTML = mail;
      var ph = document.getElementById("contact-phone");
      if (ph && tel) ph.innerHTML = tel;

      // Social icons: only the ones with a link set. An icon that goes nowhere
      // is worse than no icon, so the rest are dropped entirely.
      var links = SOCIAL_GLYPHS.filter(function (s) { return c[s.key]; });
      Array.prototype.forEach.call(document.querySelectorAll(".socials"), function (el) {
        el.innerHTML = links.map(function (s) {
          return '<a href="' + esc(c[s.key]) + '" aria-label="' + esc(s.label) +
            '" target="_blank" rel="noopener">' + s.glyph + "</a>";
        }).join("");
        el.style.display = links.length ? "" : "none";
      });
    });

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

  // ---------- Programmes (homepage cards + Programmes page rows) ----------
  // The icon set lives here rather than in Sanity: editors pick a name from a
  // dropdown, we draw the matching line icon. Keeps the studio free of markup.
  var PROG_ICONS = {
    education: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    youth: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    health: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    climate: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    community: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    advocacy: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'
  };

  function progIcon(name) {
    var paths = PROG_ICONS[name] || PROG_ICONS.education;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + paths + "</svg>";
  }

  function progBadge(p) {
    var accent = p.accent === "green" ? "green" : "purple";
    return '<span class="prog-badge prog-badge--' + accent + '" aria-hidden="true">' +
      progIcon(p.icon) + "</span>";
  }

  // Blank lines in the Sanity text box become separate paragraphs.
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).map(function (chunk) {
      return "<p>" + esc(chunk.trim()) + "</p>";
    }).join("");
  }

  var progQuery = '*[_type == "programme"] | order(order asc, _createdAt asc)' +
    '{title, "slug": slug.current, shortDescription, description, includes, icon, accent, ' +
    '"img": image.asset->url, "alt": image.alt}';

  var progGrid = document.getElementById("prog-grid");
  var progRows = document.getElementById("prog-rows");

  if (progGrid || progRows) {
    query(progQuery).then(function (progs) {
      if (!progs.length) return; // keep the built-in six until the client publishes

      if (progGrid) {
        progGrid.innerHTML = progs.map(function (p) {
          return '<a class="prog-card" href="programmes.html#' + esc(p.slug) + '">' +
            progBadge(p) +
            "<h3>" + esc(p.title) + "</h3>" +
            "<p>" + esc(p.shortDescription) + "</p>" +
            "</a>";
        }).join("");
      }

      if (progRows) {
        progRows.innerHTML = progs.map(function (p) {
          // A photo when there is one; otherwise the coloured brand panel with
          // the icon, so a programme without a picture still looks deliberate.
          var media = p.img
            ? '<div class="prog-row-media"><img src="' + esc(p.img) +
              '?w=900&h=675&fit=crop&crop=focalpoint&auto=format" alt="' +
              esc(p.alt || p.title) + '"></div>'
            : '<div class="prog-row-media prog-panel prog-panel--' +
              (p.accent === "green" ? "green" : "purple") + '" aria-hidden="true">' +
              progIcon(p.icon) + "</div>";

          var includes = (p.includes && p.includes.length)
            ? '<p class="prog-includes"><strong>What this includes:</strong> ' +
              esc(p.includes.join(", ")) + "</p>"
            : "";

          return '<div class="prog-row" id="' + esc(p.slug) + '">' + media +
            '<div class="prog-row-text">' +
            progBadge(p) +
            "<h2>" + esc(p.title) + "</h2>" +
            paragraphs(p.description) +
            includes +
            '<a class="prog-support" href="donate.html">Support this programme →</a>' +
            "</div></div>";
        }).join("");

        // Arriving at programmes.html#climate-action lands before this HTML
        // exists, so the browser has nothing to scroll to. Jump once it does.
        if (window.location.hash) {
          var target = document.getElementById(window.location.hash.slice(1));
          if (target) target.scrollIntoView();
        }
      }
    });
  }

  // ---------- Insight posts ----------
  // Undated stories sort below dated ones, then oldest-added first, which keeps
  // the running order stable as the client adds posts.
  var postQuery = '*[_type == "post"] | order(coalesce(publishedAt, "0000-01-01") desc, _createdAt asc)' +
    '{title, category, excerpt, publishedAt, linkLabel, linkUrl, "img": image.asset->url, "alt": image.alt}';

  function postCard(p) {
    var thumb = p.img
      ? '<div class="thumb"><img src="' + esc(p.img) + '?w=800&auto=format" alt="' +
        esc(p.alt || p.title) + '"></div>'
      : "";
    var link = (p.linkLabel && p.linkUrl)
      ? '<a class="more" href="' + esc(p.linkUrl) + '">' + esc(p.linkLabel) + " →</a>"
      : "";
    return '<article class="card post-card">' + thumb +
      '<div class="body">' +
      '<span class="post-meta">' + esc(p.category || "News") +
      (p.publishedAt ? " · " + fmtDate(p.publishedAt) : "") + "</span>" +
      "<h3>" + esc(p.title) + "</h3>" +
      "<p>" + esc(p.excerpt) + "</p>" +
      link +
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
    query('*[_type == "galleryItem"] | order(_createdAt desc) {caption, "img": image.asset->url, "alt": image.alt, "video": video.asset->url}')
      .then(function (items) {
        if (!items.length) return;
        galleryGrid.innerHTML = items.map(function (it) {
          var media = it.video
            ? '<video src="' + esc(it.video) + '" controls muted playsinline style="width:100%;height:280px;object-fit:cover;"></video>'
            : '<img src="' + esc(it.img) + '?w=900&auto=format" alt="' + esc(it.alt || it.caption) + '">';
          return '<figure class="gallery-item">' + media +
            "<figcaption>" + esc(it.caption) + "</figcaption></figure>";
        }).join("");
      });
  }

  // ---------- Donation amounts & bank details (Donate page) ----------
  var tiersGrid = document.getElementById("donation-tiers");
  if (tiersGrid) {
    query('*[_type == "donationTier"] | order(order asc, _createdAt asc){amount, description}')
      .then(function (tiers) {
        if (!tiers.length) return;
        tiersGrid.innerHTML = tiers.map(function (t) {
          return '<div class="card center">' +
            "<h3>" + esc(t.amount) + "</h3>" +
            "<p>" + esc(t.description) + "</p>" +
            "</div>";
        }).join("");
      });
  }

  var bank = document.getElementById("bank-details");
  if (bank) {
    query('*[_type == "donationSettings"][0]{accountName, bankName, accountNumber}')
      .then(function (b) {
        if (!b) return;
        function row(name, value, pending) {
          return "<li><span class=\"doc-name\">" + esc(name) + "</span>" +
            '<span class="doc-status">' + esc(value || pending) + "</span></li>";
        }
        bank.innerHTML =
          row("Account Name", b.accountName, "[Account name: to be added]") +
          row("Bank", b.bankName, "[Bank name: to be added]") +
          row("Account Number", b.accountNumber, "[Account number: to be added]");
      });
  }

  // ---------- Events ----------
  var eventsList = document.getElementById("events-list");
  if (eventsList) {
    // Undated ("TBA") events all tie on the date, so _createdAt breaks the tie
    // and keeps their order stable between page loads.
    query('*[_type == "event"] | order(coalesce(date, "9999-12-31") asc, _createdAt asc) {title, category, location, timeInfo, date, description, accent}')
      .then(function (events) {
        if (!events.length) return;
        eventsList.innerHTML = events.map(function (ev) {
          var d = ev.date ? new Date(ev.date) : null;
          var day = d ? d.getDate() : "–";
          var month = d ? d.toLocaleDateString("en-GB", { month: "short" }) : "TBA";
          var badge = ev.accent === "purple" ? "badge" : "badge green";
          return '<div class="card event-card">' +
            '<div class="event-date"><div class="day">' + day + '</div><div class="month">' + esc(month) + "</div></div>" +
            "<div>" +
            '<span class="' + badge + '">' + esc(ev.category || "Event") + "</span>" +
            "<h3>" + esc(ev.title) + "</h3>" +
            '<p class="event-meta">📍 ' + esc(ev.location || "To be announced") +
            " · 🕘 " + esc(ev.timeInfo || (d ? fmtDate(ev.date) : "Date to be announced")) + "</p>" +
            "<p>" + esc(ev.description) + "</p>" +
            '<a class="btn btn-outline" href="#register" style="margin-top:14px;">Register Interest</a>' +
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
