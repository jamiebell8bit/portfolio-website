(() => {
  'use strict';
  const pages = [...document.querySelectorAll('.page')];
  const main = document.querySelector('main');
  const home = document.querySelector('#about');
  const carousel = document.querySelector('.carousel');
  const track = document.querySelector('.carousel-track');
  const group = document.querySelector('.project-group');
  const cards = [...group.children];
  const controls = document.querySelector('.carousel-controls');
  const motionButton = document.querySelector('.motion-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const touchLayout = matchMedia('(max-width: 760px), (pointer: coarse)');
  let offset = 0;
  let cycleWidth = 0;
  let looping = false;
  let userPaused = false;
  let hovered = false;
  let keyboardFocused = false;
  let lastTime = 0;
  let frame = 0;
  let navigatingUntil = 0;

  // Visual copies create a seamless loop. Only the original four links enter
  // the tab order and screen-reader tree. Copies still work with the mouse.
  for (let i = 0; i < 2; i++) {
    const copy = group.cloneNode(true);
    copy.dataset.copy = 'true';
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
    track.append(copy);
  }

  function draw() {
    track.style.transform = looping ? 'translate3d(' + (-offset) + 'px, 0, 0)' : '';
  }
  function shouldMove() {
    return looping && !userPaused && !hovered && !keyboardFocused && !home.hidden && !document.hidden;
  }
  function tick(time) {
    const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0;
    lastTime = time;
    if (shouldMove() && time > navigatingUntil && cycleWidth > 0) {
      offset = (offset + elapsed * 0.028) % cycleWidth; // 28 pixels/second.
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function updateMotionLabel() {
    motionButton.setAttribute('aria-pressed', String(userPaused));
    motionButton.setAttribute('aria-label', userPaused ? 'Resume automatic project movement' : 'Pause automatic project movement');
    motionButton.querySelector('.motion-label').textContent = userPaused ? 'Play' : 'Pause';
    motionButton.querySelector('.motion-symbol').textContent = userPaused ? '▷' : 'Ⅱ';
  }
  function configure() {
    if (home.hidden) return;
    looping = !touchLayout.matches && !reducedMotion.matches;
    carousel.classList.toggle('is-looping', looping);
    track.querySelectorAll('[data-copy]').forEach(copy => { copy.hidden = !looping; });
    motionButton.hidden = !looping;
    cycleWidth = group.getBoundingClientRect().width;
    offset = cycleWidth ? offset % cycleWidth : 0;
    carousel.scrollLeft = 0;
    draw();
    updateMotionLabel();
  }
  function render(moveFocus = false) {
    const id = location.hash.slice(1) || 'about';
    // The skip link changes focus, not the displayed project.
    if (id === 'content') { main.focus(); return; }
    const current = pages.find(page => page.id === id) || home;
    pages.forEach(page => { page.hidden = page !== current; });
    document.querySelectorAll('.site-header nav a[href^="#"]').forEach(link => {
      const active = link.hash === '#' + current.id || (link.hasAttribute('data-home-link') && current.id !== 'direct-coil');
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = 'James Bell — ' + (current === home ? 'Portfolio' : current.querySelector('h1').textContent);
    hovered = false;
    keyboardFocused = false;
    configure();
    if (moveFocus) {
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  carousel.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') hovered = true;
  });
  carousel.addEventListener('pointerleave', () => { hovered = false; });
  carousel.addEventListener('focusin', event => {
    keyboardFocused = true;
    const index = cards.indexOf(event.target.closest('.project-card'));
    if (looping && index >= 0) {
      const step = cycleWidth / cards.length;
      const left = index * step;
      const visibleWidth = carousel.clientWidth - 2 * parseFloat(getComputedStyle(carousel).paddingLeft);
      if (left < offset || left + cards[index].offsetWidth > offset + visibleWidth) offset = left;
      carousel.scrollLeft = 0;
      draw();
    }
  });
  carousel.addEventListener('focusout', () => {
    queueMicrotask(() => { keyboardFocused = carousel.contains(document.activeElement); });
  });
  motionButton.addEventListener('click', () => { userPaused = !userPaused; updateMotionLabel(); });
  document.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => {
      const step = cycleWidth / cards.length;
      const direction = Number(button.dataset.direction);
      if (looping && cycleWidth) {
        offset = ((Math.round(offset / step) + direction) * step + cycleWidth) % cycleWidth;
        navigatingUntil = performance.now() + 1800;
        draw();
      } else {
        carousel.scrollBy({ left: direction * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
    });
  });
  window.addEventListener('hashchange', () => render(true));
  window.addEventListener('resize', configure);
  reducedMotion.addEventListener('change', configure);
  touchLayout.addEventListener('change', configure);
  document.addEventListener('visibilitychange', () => { lastTime = 0; });
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
  window.addEventListener('pageshow', event => {
    if (event.persisted) { lastTime = 0; frame = requestAnimationFrame(tick); }
  });
  controls.hidden = false;
  render();
  frame = requestAnimationFrame(tick);
})();
