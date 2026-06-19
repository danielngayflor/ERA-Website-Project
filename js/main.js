/* ERA – Environmental Rights Africa | Main JS */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile nav toggle --- */
  const hamburger = document.querySelector('.c-hamburger');
  const mobileNav = document.querySelector('.c-mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
    });
  }

  /* --- Active nav link --- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.c-nav__link, .c-mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  /* --- Contact form submission (demo) --- */
  const form = document.querySelector('.js-contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Message Sent ✓';
      btn.disabled = true;
      btn.style.background = 'var(--color-forest)';
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Mark scroll-reveal targets --- */
  // Section headers
  document.querySelectorAll('.l-section__header').forEach(el => {
    el.classList.add('js-reveal');
  });

  // Cards
  document.querySelectorAll('.l-cards').forEach(grid => {
    grid.classList.add('js-stagger');
    grid.querySelectorAll('.c-card').forEach(card => card.classList.add('js-reveal'));
  });

  // Pillars
  const pillarsGrid = document.querySelector('.c-pillars');
  if (pillarsGrid) {
    pillarsGrid.classList.add('js-stagger');
    pillarsGrid.querySelectorAll('.c-pillar').forEach(p => p.classList.add('js-reveal'));
  }

  // How-we-work boxes
  document.querySelectorAll('.c-how-grid > div, .c-how-grid > article').forEach((el, i) => {
    el.classList.add('js-reveal');
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  // Join ways
  document.querySelectorAll('.c-join-way').forEach((el, i) => {
    el.classList.add('js-reveal');
    el.style.transitionDelay = (i * 0.08) + 's';
  });

  // Region cards
  document.querySelectorAll('.c-region').forEach((el, i) => {
    el.classList.add('js-reveal');
    el.style.transitionDelay = (i * 0.07) + 's';
  });

  // Banners / CTA
  document.querySelectorAll('.c-banner').forEach(el => el.classList.add('js-reveal'));

  // Generic article headings & lead paragraphs in sections
  document.querySelectorAll('.l-section h2.t-headline, .l-section .t-lead').forEach(el => {
    if (!el.closest('.l-section__header')) el.classList.add('js-reveal');
  });

  /* --- Intersection Observer for scroll reveals --- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.js-reveal, .js-reveal-left, .js-reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  /* --- Stat count-up animation --- */
  const statsBar = document.querySelector('.c-billboard__stats');
  if (statsBar) {
    const statNumbers = statsBar.querySelectorAll('.c-stat__number');

    const countUp = (el) => {
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/\D/g, ''), 10);
      const suffix = raw.replace(/[\d]/g, '');
      if (isNaN(num)) return;

      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(el => countUp(el));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsBar);
  }

  /* --- Navbar: add shadow on scroll --- */
  const header = document.querySelector('.l-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

});
