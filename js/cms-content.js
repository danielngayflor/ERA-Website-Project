/**
 * cms-content.js
 * Fetches content from /content/*.json and renders it into the public pages.
 * Loaded on news.html, about.html, and index.html.
 */

// ─── Resources (news.html) ───────────────────────────────────────────────────

async function renderResources() {
  const grid = document.getElementById('hubGrid');
  const emptyMsg = document.getElementById('hubEmpty');
  if (!grid) return;

  let data;
  try {
    const res = await fetch('/content/resources.json?v=' + Date.now());
    data = await res.json();
  } catch (e) {
    console.error('ERA CMS: failed to load resources.json', e);
    return;
  }

  // Only show published resources
  const resources = (data.resources || []).filter(r => r.status === 'published');

  grid.innerHTML = resources.map(r => {
    const imgHtml = r.image
      ? `<img class="c-resource-card__img" src="${r.image}" alt="${esc(r.imageAlt || r.title)}" />`
      : '';

    const footerLinks = [];
    if (r.linkUrl) {
      const isExternal = r.linkUrl.startsWith('http');
      const extAttr = isExternal ? ' target="_blank" rel="noopener"' : '';
      footerLinks.push(`<a href="${r.linkUrl}"${extAttr} class="c-resource-card__link">${esc(r.linkLabel || 'Read More →')}</a>`);
    }
    if (r.downloadUrl) {
      footerLinks.push(`<a href="${r.downloadUrl}" download style="font-size:0.8rem; color:var(--color-terra); font-weight:600; text-decoration:none; margin-left:0.75rem;">↓ PDF</a>`);
    }
    if (r.externalBadge) {
      footerLinks.push(`<span class="c-resource-card__ext-badge">External ↗</span>`);
    }
    if (footerLinks.length === 0) {
      footerLinks.push(`<span style="font-size:0.8rem; color:var(--color-text-muted);">Coming soon</span>`);
    }

    const modClass = r.category === 'external' ? ' c-resource-card--external'
                   : r.category === 'newsletter' ? ' c-resource-card--newsletter'
                   : r.category === 'opinion'  ? ' c-resource-card--opinion'
                   : r.category === 'casestudy' ? ' c-resource-card--casestudy'
                   : '';

    return `
<div class="c-resource-card${modClass}" data-category="${r.category}" id="${r.id}">
  ${imgHtml}
  <div class="c-resource-card__body">
    <span class="c-resource-card__tag">${esc(r.tag)}</span>
    <h2 class="c-resource-card__title">${esc(r.title)}</h2>
    ${r.meta ? `<p class="c-resource-card__meta">${esc(r.meta)}</p>` : ''}
    <p class="c-resource-card__excerpt">${esc(r.excerpt)}</p>
  </div>
  <div class="c-resource-card__footer">
    ${footerLinks.join('\n    ')}
  </div>
</div>`;
  }).join('\n');

  // Re-initialise the filter buttons now that cards exist in the DOM
  initResourceFilters();
}

function initResourceFilters() {
  const filters = document.querySelectorAll('.c-hub-filter');
  const emptyMsg = document.getElementById('hubEmpty');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;
      const cards = document.querySelectorAll('.c-resource-card');
      let visible = 0;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? 'flex' : 'none';
        if (show) visible++;
      });
      if (emptyMsg) emptyMsg.style.display = visible === 0 ? 'block' : 'none';
    });
  });
}

// ─── Team (about.html) ───────────────────────────────────────────────────────

async function renderTeam() {
  const secretariatEl = document.getElementById('teamSecretariat');
  const steeringEl = document.getElementById('teamSteering');
  if (!secretariatEl && !steeringEl) return;

  let data;
  try {
    const res = await fetch('/content/team.json?v=' + Date.now());
    data = await res.json();
  } catch (e) {
    console.error('ERA CMS: failed to load team.json', e);
    return;
  }

  if (secretariatEl && data.secretariat) {
    secretariatEl.innerHTML = data.secretariat.map(m => `
<div class="c-team-member">
  <p class="c-team-member__name">${esc(m.name)}</p>
  <p class="c-team-member__role">${esc(m.role)}</p>
</div>`).join('\n');
  }

  if (steeringEl && data.steering) {
    steeringEl.innerHTML = data.steering.map(m => {
      const borderStyle = m.highlight === 'chairman' || m.highlight === 'chair'
        ? ' style="border-left-color:var(--color-terra);"'
        : m.highlight === 'observer'
        ? ' style="border-left-color:var(--color-gray-3);"'
        : '';
      return `
<div class="c-team-member"${borderStyle}>
  <p class="c-team-member__name">${esc(m.name)}</p>
  <p class="c-team-member__role">${esc(m.role)}</p>
</div>`;
    }).join('\n');
  }
}

// ─── Partners / Donors (index.html) ──────────────────────────────────────────

async function renderPartners() {
  const logosEl = document.getElementById('donorLogos');
  if (!logosEl) return;

  let data;
  try {
    const res = await fetch('/content/partners.json?v=' + Date.now());
    data = await res.json();
  } catch (e) {
    console.error('ERA CMS: failed to load partners.json', e);
    return;
  }

  if (data.partners) {
    logosEl.innerHTML = data.partners.map(p => {
      const img = `<img src="${p.logo}" alt="${esc(p.name)}" class="c-donors__logo" />`;
      return p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${img}</a>` : img;
    }).join('\n');
  }
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function esc(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
