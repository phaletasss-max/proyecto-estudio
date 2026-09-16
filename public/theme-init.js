// Runs before first paint without inline scripts or CSP exceptions.
try {
  document.documentElement.classList.add(localStorage.getItem('shadowbytes_theme') === 'light' ? 'light' : 'dark');
} catch {
  document.documentElement.classList.add('dark');
}

// The nonblocking font stylesheet becomes active when its download completes.
document.addEventListener('load', function (event) {
  if (event.target instanceof HTMLLinkElement && event.target.id === 'reading-font') {
    event.target.media = 'all';
  }
}, true);
