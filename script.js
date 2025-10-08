// ===== Safe, defensive JS for your portfolio =====
(() => {
  // Hamburger menu (used by inline onclick)
  function toggleMenu() {
    const menu = document.querySelector('#hamburger-nav .menu-links');
    const icon = document.querySelector('#hamburger-nav .hamburger-icon');
    if (!menu || !icon) return;
    menu.classList.toggle('open');
    icon.classList.toggle('open');
  }
  window.toggleMenu = toggleMenu;

  // Theme toggle with safe image swapping
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

  // Optional: log runtime errors to console
  window.addEventListener('error', (e) => {
    console.error('[Runtime Error]', e.error || e.message || e);
  });
})();
