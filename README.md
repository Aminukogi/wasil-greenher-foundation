# Wasil GreenHer Foundation — Website

A modern, mobile-friendly website: static HTML/CSS/JS frontend + an optional
**Sanity Studio** backend for editing content visually (see `SANITY-SETUP.md`).

**Navigation:** Home · About Us · Programmes (with Events tab) · Insight (with Gallery tab) · Contact.
Donate, Volunteer, Partner and Transparency are reached from the homepage buttons and the footer.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About Us (mission, vision, story, team) |
| `programmes.html` | Our 6 programme areas |
| `insight.html` | Blog / news ("Insight") |
| `gallery.html` | Photo gallery with lightbox |
| `events.html` | Events calendar + online registration |
| `volunteer.html` | Volunteer application form |
| `partner.html` | Partnership enquiry form |
| `donate.html` | Donation page |
| `transparency.html` | Annual/financial reports, governance, policies |
| `contact.html` | Contact form + details |
| `privacy.html` | Privacy & safeguarding policy |

## Before going live — checklist

1. **Add the photos** — save your 5 images into the `images/` folder using the exact
   file names listed in `images/PUT-YOUR-PHOTOS-HERE.txt`.
2. **Connect the forms** — forms currently show a local "thank you" message but do not
   send anything. Create a free account at [formspree.io](https://formspree.io), create a
   form, then in each `<form data-demo>` set `action="https://formspree.io/f/YOUR-ID"`,
   add `method="POST"`, and remove the `data-demo` attribute.
   (If you host on Netlify, you can instead just add `data-netlify="true"` to each form.)
3. **Fill in placeholders**:
   - `donate.html` — bank name and account number
   - `contact.html` — real email address and phone number
   - Footer social links (`href="#"`) on every page — replace with your real profiles
4. **Update sample content** — events on `events.html` are marked "TBA"; impact numbers
   on the homepage stats band are estimates — adjust to your real figures.

## How to preview locally

Just double-click `index.html`, or in VS Code use the "Live Server" extension.

## How to publish (free options)

- **Netlify** (easiest): go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this whole folder in. Free form handling included.
- **GitHub Pages**: push this folder to a GitHub repo → Settings → Pages → deploy from branch.
- **Vercel**: `vercel deploy` or import the repo at vercel.com.

Then connect your own domain (e.g. `wasilgreenher.org`) in the host's settings.

## Editing content

**The easy way (recommended):** set up Sanity Studio — follow `SANITY-SETUP.md`.
You then manage Insight posts, gallery photos/videos, events and the homepage
hero slideshow from a visual editor, no code needed.

**Directly in the files:**
- Homepage background slideshow: edit the `.hero-slides` block at the top of `index.html`
  (photo slides and video slides — instructions are in a comment right there).
- Site-wide colors and fonts: `css/styles.css` (`:root` variables at the top).
- Menu and footer appear in every HTML file — if you change them, change them in all files.
- Blog post: copy one `<article class="card post-card">…</article>` block in `insight.html`.
- Event: copy one `<div class="card event-card">…</div>` block in `events.html`.
- Gallery photo: drop the image in `images/` and copy a `<figure class="gallery-item">` block in `gallery.html`.
