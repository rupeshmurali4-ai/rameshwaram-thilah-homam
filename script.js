/* ============================================
   RAMESWARAM THILA HOMAM — Interactions
   ============================================ */

(() => {
  'use strict';

  /* ---------- Navbar scroll + mobile toggle ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const closeMenu = () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    backdrop.classList.remove('open');
  };

  const openMenu = () => {
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    backdrop.classList.add('open');
  };

  const backdrop = document.getElementById('navBackdrop');

  navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 767) closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((l) => {
              l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.35, rootMargin: '-80px 0px -50% 0px' }
    );
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------- Gallery filter ---------- */
  const filters = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((f) => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      galleryItems.forEach((item) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIdx = 0;
  let visibleItems = [];

  const getVisibleItems = () =>
    Array.from(galleryItems).filter((i) => !i.classList.contains('hidden'));

  const showImage = (idx) => {
    visibleItems = getVisibleItems();
    if (idx >= visibleItems.length) idx = 0;
    if (idx < 0) idx = visibleItems.length - 1;
    currentIdx = idx;
    const img = visibleItems[idx].querySelector('img');
    const fullSrc = img.src.replace('w=600', 'w=1200');
    lightboxImg.src = fullSrc;
    lightboxImg.alt = img.alt;
  };

  const openLightbox = (item) => {
    visibleItems = getVisibleItems();
    currentIdx = visibleItems.indexOf(item);
    if (currentIdx < 0) currentIdx = 0;
    showImage(currentIdx);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showImage(currentIdx - 1));
  lightboxNext.addEventListener('click', () => showImage(currentIdx + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
    if (e.key === 'ArrowRight') showImage(currentIdx + 1);
  });

  /* ---------- Testimonials carousel (mobile) ---------- */
  const track = document.getElementById('testimonialsTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];

  if (track && cards.length && window.matchMedia('(max-width: 767px)').matches) {
    dotsWrap.style.display = 'flex';
    dotsWrap.style.justifyContent = 'center';
    dotsWrap.style.gap = '8px';
    dotsWrap.style.marginTop = '28px';

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 't-dot';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.style.cssText =
        'width:8px;height:8px;border-radius:50%;border:none;background:rgba(23,74,58,0.25);transition:all .3s ease;cursor:pointer;padding:0;';
      if (i === 0) {
        dot.style.background = 'var(--green)';
        dot.style.width = '24px';
        dot.style.borderRadius = '4px';
      }
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.t-dot');
    const setActive = (idx) => {
      dots.forEach((d, i) => {
        const active = i === idx;
        d.style.background = active ? 'var(--green)' : 'rgba(23,74,58,0.25)';
        d.style.width = active ? '24px' : '8px';
        d.style.borderRadius = active ? '4px' : '50%';
      });
    };

    if ('IntersectionObserver' in window) {
      const tIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = Array.from(cards).indexOf(entry.target);
              setActive(idx);
            }
          });
        },
        { root: track, threshold: 0.6 }
      );
      cards.forEach((c) => tIO.observe(c));
    }
  }

  /* ---------- Enquiry form ---------- */
  const form = document.getElementById('enquiryForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();

      if (!name || !phone) {
        form.querySelectorAll('[required]').forEach((field) => {
          if (!field.value.trim()) {
            field.style.borderColor = '#c0392b';
            field.addEventListener('input', function handler() {
              field.style.borderColor = '';
              field.removeEventListener('input', handler);
            });
          }
        });
        return;
      }

      const service = (data.get('service') || '').toString();
      const date = (data.get('date') || '').toString();
      const people = (data.get('people') || '').toString();
      const message = (data.get('message') || '').toString();

      const text =
        `New Enquiry — Rameswaram Thila Homam%0A%0A` +
        `Name: ${encodeURIComponent(name)}%0A` +
        `Phone: ${encodeURIComponent(phone)}%0A` +
        (service ? `Service: ${encodeURIComponent(service)}%0A` : '') +
        (date ? `Preferred Date: ${encodeURIComponent(date)}%0A` : '') +
        (people ? `Number of People: ${encodeURIComponent(people)}%0A` : '') +
        (message ? `Message: ${encodeURIComponent(message)}` : '');

      window.open(`https://wa.me/918754659663?text=${text}`, '_blank', 'noopener');

      successMsg.hidden = false;
      form.reset();
      setTimeout(() => { successMsg.hidden = true; }, 5000);
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
