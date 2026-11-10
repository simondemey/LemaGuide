# LemaGuide

Website for a Kilimanjaro guide. Simple HTML/CSS/JS — no build step, free hosting on GitHub Pages.
All text, reviews and photos live in the `content/` folder and can be edited with simple forms (no coding) via **Pages CMS**.

```
index.html, style.css, script.js   the website (no need to touch)
foto/index.html                    same site, with a real Kilimanjaro photo at the top
                                   (same content files)
content/site.json                  name, about text, contact, big photos
content/routes.json                Kilimanjaro routes / tours
content/reviews.json               guest reviews
content/gallery.json               photo gallery
images/                            uploaded photos
.pages.yml                         editor forms setup
```

## One-time setup (done by you)

1. Create a GitHub repository (e.g. `LemaGuide`) and upload all these files (including the hidden `.pages.yml`).
2. In the repo: **Settings → Pages → Source: Deploy from a branch → `main` / root → Save**.
   After a minute the site is live at `https://<username>.github.io/LemaGuide/`.
3. Make a free GitHub account for the guide and add him as a collaborator (**Settings → Collaborators**).
4. Open the editor once yourself at <https://app.pagescms.org>, sign in with GitHub and select the repo to check it works.
5. Fill in his real WhatsApp number, email, about text and photo in **About me & contact**, and delete the example reviews.

## Test locally

The page loads its content files, so open it through a small web server (not by double-clicking):

```bash
python -m http.server 8000
```

Then go to <http://localhost:8000>.

---

## How to update your website (for the guide)

Use your phone or computer. Changes are online in about 1–2 minutes.

1. Go to **https://app.pagescms.org** and tap **Sign in with GitHub**.
2. Choose **LemaGuide**.
3. In the menu you see:
   - ⭐ **Reviews** – tap **Add an entry**, write the guest's name, country, date, stars and what they said. Add a photo if you have one.
   - 📷 **Photos** – tap **Add an entry**, upload a photo, write a short caption.
   - 🏔️ **Routes & tours** – change or add routes.
   - ℹ️ **About me & contact** – your story, your photo, WhatsApp number.
4. Tap **Save**. Done! ✅

Tips:
- Photos from a phone are big. Smaller photos (under 1 MB) make the site faster. WhatsApp-sending a photo to yourself and saving it makes it smaller.
- Reviews are shown newest first, based on the date.
- Only add reviews that guests really wrote (you can copy them from WhatsApp, email or TripAdvisor).
