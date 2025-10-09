// ===== nav + theme (yours, unchanged) =====
(() => {
  function toggleMenu() {
    const menu = document.querySelector('#hamburger-nav .menu-links');
    const icon = document.querySelector('#hamburger-nav .hamburger-icon');
    if (!menu || !icon) return;
    menu.classList.toggle('open');
    icon.classList.toggle('open');
  }
  window.toggleMenu = toggleMenu;

  const root = document.documentElement;
  const STORAGE_KEY = 'theme';

  function swapThemedImages(theme) {
    document.querySelectorAll('img[src-light], img[src-dark]').forEach(img => {
      const light = img.getAttribute('src-light');
      const dark = img.getAttribute('src-dark');
      if (theme === 'dark' && dark) img.src = dark;
      else if (light) img.src = light;
    });
  }
  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('theme', 'dark');
    else root.removeAttribute('theme');
    swapThemedImages(theme);
  }
  function toggleTheme() {
    const current = root.getAttribute('theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }
  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  applyTheme(saved);
  ['modeToggle', 'modeToggle2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', toggleTheme, false);
  });

  // ===== Apple Activity Rings animation =====
  function animateRings() {
    const meters = document.querySelectorAll('.skill-meter');
    if (!meters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    meters.forEach(meter => {
      meter.classList.remove('appear');
      io.observe(meter);
    });
  }

  // Respect user who prefers reduced motion → set to final state
  function reducedMotionFallback() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.skill-meter').forEach(el => {
        el.classList.add('appear');
      });
      return true;
    }
    return false;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!reducedMotionFallback()) animateRings();
  });

  // helpful error logging
  window.addEventListener('error', (e) => {
    console.error('[Runtime Error]', e.error || e.message || e);
  });
})();

(function () {
  const EASE = t => 1 - Math.pow(1 - t, 3); // easeOutCubic

  function initRing(el) {
    const circle = el.querySelector('.progress-ring__circle');
    const dot = el.querySelector('.dot');
    if (!circle || !dot) return;

    const length = circle.getTotalLength();
    const percent = Math.max(0, Math.min(100, parseFloat(el.dataset.percent) || 0));

    // set stroke dash for the full circumference, start empty
    circle.style.strokeDasharray = `${length} ${length}`;
    circle.style.strokeDashoffset = length;

    // animate once when visible (or immediately if already visible)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = () => {
      if (reduced) {
        fill(1); return;
      }
      const start = performance.now();
      const duration = 1000 + Math.random() * 400;

      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        fill(EASE(t));
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    };

    function fill(t) {
      // progress 0..1 → angle/offset
      const p = percent * t;
      const offset = length - (p / 100) * length;
      circle.style.strokeDashoffset = offset;
      dot.style.transform = `rotate(${p * 3.6}deg)`;
    }

    // intersection observer (animate once per ring)
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animate();
        io.unobserve(el);
      });
    }, { threshold: 0.35 });

    io.observe(el);
  }

  // init all rings on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
      document.querySelectorAll('.ring').forEach(initRing)
    );
  } else {
    document.querySelectorAll('.ring').forEach(initRing);
  }
})();

