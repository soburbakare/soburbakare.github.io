# soburbakare.github.io

Static portfolio site, no build step. Fonts (Fraunces, Newsreader, JetBrains Mono) load from Google Fonts.

## Keep your code private
This repository holds ONLY the website. Do not add DIMSYS gateway source here: a GitHub Pages repository is public. Keep the gateway in a separate PRIVATE repo.

## Edit in VS Code
Open the folder, install "Live Server", right-click `index.html` > Open with Live Server.

## Assets you may need to replace (same file name, drop-in, no HTML changes)
Real photographs are already in place: `assets/presentations/` (presenting + group photo) and `assets/field/` (four field photos), all resized for the web with EXIF/location data stripped.

Still placeholders in this package (swap in your real files under the SAME names; if you already have the real ones, keep yours):

| File | What it is |
|---|---|
| `assets/screenshots/ev-1-simulator-event.png` | Simulator state and controlled event (1920 x 1080) |
| `assets/screenshots/ev-2-gateway-log.png` | SP Gateway log: polling and BRCB reception |
| `assets/screenshots/ev-3-mqtt-explorer.png` | MQTT Explorer message |
| `assets/screenshots/ev-4-dashboard-metrics.png` | SpectaPower dashboard measurements |
| `assets/screenshots/ev-5-dashboard-events.png` | SpectaPower dashboard event log |
| `assets/video/dimsys-demo.mp4` | Demo video, 1920 x 1080, H.264 MP4 |

Redact credentials, broker URLs, IP addresses and utility or customer details before publishing. If an image file is ever missing, the page shows a labelled box instead of a broken-image icon.

## Structure
- Tabs: About, Experience, Writings, Talks, ON THE JOB. Contact lives in the footer under every tab.
- To add an article: open `index.html`, find `id="v-writings"`, copy the commented `<article class="wr">` template into `<div class="wrlist">` and fill in the title, description and link.
- ON THE JOB photos open in a pop-up viewer; to add one, copy a `<figure>` in `.gal` and keep `class="lb"` on its link.
- The R&D Project tab was removed from the site; its content is in the separate Word document `Sobur_Bakare_RD_Project.docx`.
- To add a presentation: copy the `<article class="pres">` block in `index.html`, add the photo to `assets/presentations/`.
- Naming: DIMSYS Technologies (company), SpectaPower (platform), SP Gateway (edge gateway), SpectaPower Config Builder (`/config-builder/`).
- No public GitHub repository is linked; keep source code and sensitive configuration private.

## Deploy to GitHub Pages
1. Create a PUBLIC repo named exactly `soburbakare.github.io`.
2. `git init && git add . && git commit -m "Portfolio" && git branch -M main`
3. `git remote add origin https://github.com/soburbakare/soburbakare.github.io.git && git push -u origin main`
4. Settings > Pages > Deploy from a branch > `main` / root.
