// Loads all website content from the files in the /content folder.
// The guide edits those files with the Pages CMS editor — no coding needed.

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const load = (name) => fetch(`content/${name}.json`, { cache: 'no-cache' }).then((r) => r.json()).catch(() => ({}));
// Images saved by the editor may start with "/" — make them relative so the site also works in a sub-folder (GitHub Pages).
const img = (src) => (src ? String(src).replace(/^\//, '') : '');

async function init() {
  const [site, routes, reviews, gallery] = await Promise.all([load('site'), load('routes'), load('reviews'), load('gallery')]);

  // Simple text fields
  document.querySelectorAll('[data-bind]').forEach((el) => {
    const v = site[el.dataset.bind];
    if (v) el.textContent = v;
  });
  if (site.guideName) document.title = `${site.guideName} · Kilimanjaro Guide`;
  document.getElementById('year').textContent = new Date().getFullYear();

  document.getElementById('about-text').innerHTML = String(site.about || '')
    .split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');

  if (site.profilePhoto) {
    document.getElementById('profile-photo').innerHTML = `<img src="${esc(img(site.profilePhoto))}" alt="${esc(site.guideName)}">`;
  }
  // The page can set a default header photo (data-default-image); a photo chosen in the editor always wins.
  const hero = document.querySelector('.hero');
  const heroSrc = site.heroImage || hero.dataset.defaultImage;
  if (heroSrc) {
    hero.style.setProperty('--hero-img', `url("${img(heroSrc)}")`);
    hero.classList.add('has-photo');
  }

  // Contact links
  const phone = String(site.whatsapp || '').replace(/\D/g, '');
  const msg = encodeURIComponent(`Hello ${site.guideName || ''}, I would like to climb Kilimanjaro!`);
  document.querySelectorAll('[data-whatsapp]').forEach((a) => {
    if (phone) { a.href = `https://wa.me/${phone}?text=${msg}`; a.target = '_blank'; a.rel = 'noopener'; }
  });
  const email = document.getElementById('email-link');
  if (site.email) email.href = `mailto:${site.email}`; else email.remove();

  // Routes
  const routeList = routes.routes || [];
  document.getElementById('routes-list').innerHTML = routeList.length
    ? routeList.map((r) => `
      <article class="card">
        <div class="card-img">${r.image ? `<img src="${esc(img(r.image))}" alt="${esc(r.name)}" loading="lazy">` : ''}</div>
        <div class="card-body">
          <div class="tags">
            ${r.days ? `<span class="tag">${esc(r.days)}</span>` : ''}
            ${r.difficulty ? `<span class="tag alt">${esc(r.difficulty)}</span>` : ''}
          </div>
          <h3>${esc(r.name)}</h3>
          <p>${esc(r.description)}</p>
        </div>
      </article>`).join('')
    : '<p class="empty">Routes coming soon.</p>';

  // Gallery
  const photos = (gallery.photos || []).filter((p) => p.image);
  const galleryEl = document.getElementById('gallery-list');
  galleryEl.innerHTML = photos.length
    ? photos.map((p) => `
      <figure data-src="${esc(img(p.image))}" data-caption="${esc(p.caption)}">
        <img src="${esc(img(p.image))}" alt="${esc(p.caption || 'Kilimanjaro photo')}" loading="lazy">
        ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}
      </figure>`).join('')
    : '<p class="empty">Photos coming soon.</p>';

  // Reviews (newest first)
  const list = (reviews.reviews || []).slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  document.getElementById('reviews-list').innerHTML = list.length
    ? list.map((r) => {
      const stars = Math.max(1, Math.min(5, Number(r.rating) || 5));
      const date = r.date ? new Date(r.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '';
      const avatar = r.photo
        ? `<img class="avatar" src="${esc(img(r.photo))}" alt="">`
        : `<span class="avatar">${esc((r.name || '?').trim().charAt(0).toUpperCase())}</span>`;
      return `
        <article class="review">
          <div class="stars" aria-label="${stars} out of 5 stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div>
          <blockquote>“${esc(r.text)}”</blockquote>
          <div class="reviewer">${avatar}<div><strong>${esc(r.name)}</strong><small>${esc([r.country, date].filter(Boolean).join(' · '))}</small></div></div>
        </article>`;
    }).join('')
    : '<p class="empty">Be the first to leave a review!</p>';

  if (list.length) {
    const avg = list.reduce((s, r) => s + (Number(r.rating) || 5), 0) / list.length;
    document.getElementById('avg-rating').textContent = `${avg.toFixed(1)}★`;
  }

  // Lightbox for photos
  const lb = document.getElementById('lightbox');
  galleryEl.addEventListener('click', (e) => {
    const fig = e.target.closest('figure');
    if (!fig) return;
    lb.querySelector('img').src = fig.dataset.src;
    lb.querySelector('p').textContent = fig.dataset.caption || '';
    lb.hidden = false;
  });
  lb.addEventListener('click', () => { lb.hidden = true; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.hidden = true; });
}

init();
