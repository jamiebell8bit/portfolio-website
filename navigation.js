(() => {
  const pages = [...document.querySelectorAll('.page')];
  const links = [...document.querySelectorAll('nav a')];
  function render(moveFocus = false) {
    const id = location.hash.slice(1) || 'about';
    const current = pages.find(page => page.id === id) || pages[0];
    pages.forEach(page => { page.hidden = page !== current; });
    links.forEach(link => {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = 'James Bell — ' + (current.id === 'about' ? 'About' : current.querySelector('h1').textContent);
    if (moveFocus) {
      document.querySelector('main').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  window.addEventListener('hashchange', () => render(true));
  render();
})();
