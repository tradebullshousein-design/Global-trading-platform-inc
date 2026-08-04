/* script.js
   Handles interactivity:
   - Loader hide
   - Mobile nav toggle
   - Scroll reveal (IntersectionObserver)
   - Counters animation
   - FAQ accordion
   - Contact form basic validation (placeholder)
   - Back-to-top button
   - Mouse glow position
*/

/* DOM utilities */
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

/* When DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  // Hide loader
  const loader = $('#loader');
  setTimeout(() => {
    if (loader) loader.style.opacity = '0';
    setTimeout(() => loader && loader.remove(), 450);
  }, 700);

  // Set year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const hamburger = $('#hamburger');
  const navMenu = $('#navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('show');
      // animate hamburger
      hamburger.classList.toggle('open');
    });
  }

  // Smooth scroll for internal links (supports offset if needed)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile menu if open
        if (navMenu && navMenu.classList.contains('show')) navMenu.classList.remove('show');
      }
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // once revealed, unobserve to improve performance
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => obs.observe(r));

  // Counters
  const counters = document.querySelectorAll('.stat-number, .stat-num');
  counters.forEach(counter => animateCounter(counter));

  // Floating hero stat counters (separate smaller ones)
  const heroStats = document.querySelectorAll('.floating-stats .stat-num');
  heroStats.forEach(s => animateCounter(s, {duration:1600, format: formatLarge}));

  // FAQ accordion
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const open = panel.style.display === 'block';
      document.querySelectorAll('.acc-panel').forEach(p => p.style.display = 'none');
      if (!open) panel.style.display = 'block';
    });
  });

  // Contact form basic validation & feedback (does not send)
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const phone = contactForm.phone.value.trim();
      const message = contactForm.message.value.trim();
      const feedback = contactForm.querySelector('.form-feedback');

      if (!name || !email || !phone || !message) {
        feedback.textContent = 'Please fill in all required fields.';
        return;
      }
      // Mock submission
      feedback.textContent = 'Sending…';
      setTimeout(() => {
        feedback.textContent = 'Thanks! Your message has been received. We will contact you shortly.';
        contactForm.reset();
      }, 900);
    });
  }

  // Back to top button
  const backToTop = $('#backToTop');
  window.addEventListener('scroll', () => {
    if (!backToTop) return;
    if (window.scrollY > 400) backToTop.style.display = 'block';
    else backToTop.style.display = 'none';
  });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  // Mouse glow follow
  const mg = $('#mouse-glow');
  document.addEventListener('mousemove', (e) => {
    if (!mg) return;
    mg.style.setProperty('--x', `${e.clientX}px`);
    mg.style.setProperty('--y', `${e.clientY}px`);
    // small opacity pulse on movement
    mg.style.opacity = '1';
    clearTimeout(mg._fade);
    mg._fade = setTimeout(()=> mg.style.opacity = '.65', 700);
  });

  // Market card hover small effect (optional simple)
  document.querySelectorAll('.market-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('hover'));
  });

  // Accessibility: close nav on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
      hamburger && hamburger.setAttribute('aria-expanded','false');
    }
  });

  // Reveal trading symbol on market-card click (nice UX)
  document.querySelectorAll('.market-card').forEach(card => {
    card.addEventListener('click', () => {
      const symbol = card.dataset.symbol || 'BTC';
      // If TradingView widget exists and supports setSymbol, attempt to change symbol (some widgets may not expose it directly)
      try {
        if (window.tvWidget && typeof window.tvWidget.setSymbol === 'function') {
          window.tvWidget.setSymbol(symbol, '60');
        }
      } catch (e) {
        // ignore; safe fallback
      }
    });
  });
});

/* Helper: counters animation
   element: DOM node with data-target attribute or inner text number
   options: {duration}
*/
function animateCounter(element, options = {}) {
  const duration = options.duration || 2200;
  const format = options.format || formatNumber;
  let target = Number(element.getAttribute('data-target') || element.textContent.replace(/[^0-9.]/g,'') || 0);
  if (isNaN(target)) target = 0;
  if (target === 0) return;
  const start = 0;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.floor(eased * (target - start) + start);
    element.textContent = format(current, target);
    if (progress < 1) requestAnimationFrame(step);
    else {
      // show precise for floats (like 99.9)
      if (String(target).includes('.')) element.textContent = format(target, target);
    }
  }
  requestAnimationFrame(step);
}

function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function formatNumber(value) {
  // Add suffixes for thousands/millions
  if (value >= 10000000) return '₹' + Math.round(value/10000000) + ' Cr';
  if (value >= 100000) return '₹' + Math.round(value/100000) + ' L';
  if (value >= 1000) return '₹' + (value/1000).toLocaleString() + 'K';
  return value.toLocaleString();
}

function formatLarge(value, target) {
  // Friendly formatting for hero small stats
  if (target >= 1000000) return (value/1000000).toFixed(1) + 'M+';
  if (target >= 10000) return (value/1000).toFixed(0) + 'K+';
  if (String(target).includes('.')) return value.toFixed(1) + '%';
  return value.toString();
}

/* Note:
   - This file keeps logic minimal and avoids third-party libs.
   - For production, consider debouncing mousemove, optimizing counters and
     preloading critical assets, and wiring contact form to a backend.
*/