# Sanity Studio Setup — one-time, ~10 minutes

Sanity Studio is your website's friendly backend. Once set up, you (or anyone on
your team) can add **news stories, gallery photos/videos, events and homepage
hero slides** from a simple visual editor — no coding, and the website updates
automatically. The free plan is more than enough for an NGO site.

## 1. Create your Sanity project

1. Go to **[sanity.io](https://www.sanity.io)** → *Get started* → sign up (Google login works).
2. In **[sanity.io/manage](https://www.sanity.io/manage)** click **Create project**.
   Name it "Wasil GreenHer Foundation". Choose the free plan and a dataset named `production` (public).
3. On the project page, copy the **Project ID** (looks like `ab12cd34`).

## 2. Connect the ID — ✅ ALREADY DONE

Your Project ID (`50kkp3hz`, dataset `production`) is already filled in for you in:

- `js/sanity-config.js` ← makes the website read your content
- `studio/sanity.config.js` ← makes the Studio save to your project
- `studio/sanity.cli.js`

> Note: you do **not** need to run the `npm create sanity@latest ...` command from
> the Sanity dashboard — the studio is already built for you in the `studio/`
> folder, with all content types ready. Just run it (step 4 below).

## 3. Allow your website to read the content (CORS)

In [sanity.io/manage](https://www.sanity.io/manage) → your project → **API** → **CORS origins** → *Add CORS origin*, add:

- `http://localhost:5500` (and `http://127.0.0.1:5500`) — for local preview with VS Code Live Server
- your live site URL later, e.g. `https://wasilgreenher.org` and the Netlify/Vercel URL

("Allow credentials" can stay off — the site only reads public content.)

> ⚠️ Important: to see Sanity content on the website locally, open the site through
> a local server (e.g. VS Code **Live Server** → `http://localhost:5500`), **not** by
> double-clicking `index.html`. Files opened directly (`file://…`) can't read from
> Sanity for browser-security reasons — the site just shows its built-in content
> instead. Serving over `http://` (and adding that address above) makes CMS
> content appear.

## 4. Run the Studio  ✅ ALREADY INSTALLED

The studio is installed and ready. It lives in a fast local folder (outside
OneDrive) at:

```
C:\Users\Surface Book2\Projects\wgf-studio
```

**To open the editor, just double-click the Desktop shortcut:**

> 🖱️ **"Edit Website (Wasil GreenHer)"** on your Desktop.

A black window opens and, after a moment, prints `http://localhost:3333`. Open
that address in your browser to edit. Keep the black window open while you work;
close it to stop the editor. (First time, log in with the same account you used
to create the Sanity project.)

> Behind the scenes the shortcut runs `start-studio.bat`, which uses Node
> v20.19.4 (the version Sanity needs) from
> `C:\Users\Surface Book2\node-portable`. If you ever prefer a terminal:
> `cd "C:\Users\Surface Book2\Projects\wgf-studio"` then `npm run dev`.

Once open, you'll see five sections:

| Section | What it controls |
|---|---|
| **Homepage & Site Images** | The "Who We Are" photo on the homepage (upload one to replace it) |
| **Hero Slides** | The photos/videos rotating behind the homepage headline |
| **Insight** | News & stories on the Insight page (+ latest 3 on the homepage) |
| **Gallery** | Photos and short videos on the Gallery page |
| **Events** | The events list and the registration form's dropdown |

> To change the homepage "Who We Are" photo: open **Homepage & Site Images**,
> upload a photo (a wide/landscape one looks best), drag the crop dot to the
> focus point, and **Publish**. Until you do, the site keeps its built-in photo.

Click **Publish** on a document and it appears on the website within a minute
(refresh the page).

## 5. Put the Studio online (optional but recommended)

So you can edit from any device (phone, another computer) without running
anything locally, in a terminal:

```
cd "C:\Users\Surface Book2\Projects\wgf-studio"
npm run deploy
```

Pick a name like `wasilgreenher` → your editor lives at
**https://wasilgreenher.sanity.studio** — bookmark it, log in, edit anywhere.
(When you're ready to do this, I can run it for you.)

## Videos

Both **Hero Slides** and **Gallery** accept a short MP4 upload. For hero slides,
keep clips under ~15 seconds and ~10 MB (they autoplay silently). To swap a
video, just upload a new file to the same slide and Publish.

## How it works / if something looks wrong

The website keeps its built-in starter content until Sanity is configured and
has published documents — so nothing ever looks broken. If your content doesn't
show up: check the Project ID in `js/sanity-config.js`, make sure the document
is **Published** (not draft), and confirm the CORS origin matches the address
in your browser bar.
