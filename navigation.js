(() => {
  'use strict';

  const pages = [...document.querySelectorAll('.page')];
  const main = document.querySelector('main');
  const home = document.querySelector('#about');
  const contactEmail = document.querySelector('#contact-email');
  const copyEmail = document.querySelector('#copy-email');
  const copyEmailStatus = document.querySelector('#copy-email-status');
  copyEmail.hidden = false;
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(contactEmail.textContent.trim());
      copyEmailStatus.textContent = 'Email copied. Paste it into your email app.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(contactEmail);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyEmailStatus.textContent = 'Select and copy the email address above, then paste it into your email app.';
    }
  });
  const imageViewer = document.querySelector('#image-viewer');
  const viewerImage = document.querySelector('#image-viewer-image');
  const viewerCaption = document.querySelector('#image-viewer-caption');
  const viewerViewport = document.querySelector('#image-viewer-viewport');
  const viewerCanvas = document.querySelector('#image-viewer-canvas');
  let zoom = 1;
  let drag = null;
  let imageTrigger = null;

  function renderZoom(resetPosition = false, anchor = null) {
    if (!imageViewer.open || !viewerImage.naturalWidth) return;
    const oldWidth = viewerImage.offsetWidth || 1;
    const oldHeight = viewerImage.offsetHeight || 1;
    const viewportBounds = viewerViewport.getBoundingClientRect();
    const focusX = anchor ? anchor.clientX - viewportBounds.left - viewerViewport.clientLeft : viewerViewport.clientWidth / 2;
    const focusY = anchor ? anchor.clientY - viewportBounds.top - viewerViewport.clientTop : viewerViewport.clientHeight / 2;
    const centerX = (viewerViewport.scrollLeft + focusX - viewerImage.offsetLeft) / oldWidth;
    const centerY = (viewerViewport.scrollTop + focusY - viewerImage.offsetTop) / oldHeight;
    const ratio = viewerImage.naturalWidth / viewerImage.naturalHeight;
    // Use the full inner area so scrollbars do not change the fitted scale.
    const fitWidth = Math.min(viewerViewport.offsetWidth - viewerViewport.clientLeft * 2,
      (viewerViewport.offsetHeight - viewerViewport.clientTop * 2) * ratio);
    const width = Math.round(fitWidth * zoom);
    const height = Math.round(width / ratio);
    viewerImage.style.width = width + 'px';
    viewerImage.style.height = height + 'px';
    viewerCanvas.style.width = width + 'px';
    viewerCanvas.style.height = height + 'px';
    viewerViewport.scrollLeft = resetPosition ? 0 : viewerImage.offsetLeft + Math.max(0, Math.min(1, centerX)) * width - focusX;
    viewerViewport.scrollTop = resetPosition ? 0 : viewerImage.offsetTop + Math.max(0, Math.min(1, centerY)) * height - focusY;
    viewerViewport.classList.toggle('is-zoomed', zoom > 1);
  }

  function changeZoom(action) {
    zoom = action === 'fit' ? 1 : Math.max(1, Math.min(6, zoom * (action === 'in' ? 1.5 : 1 / 1.5)));
    renderZoom(action === 'fit');
  }

  viewerViewport.addEventListener('wheel', event => {
    if (!imageViewer.open || !viewerImage.naturalWidth || event.deltaY === 0) return;
    event.preventDefault();
    // Normalize mouse wheels and trackpads, then zoom toward the pointer.
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewerViewport.clientHeight : 1);
    const nextZoom = Math.max(1, Math.min(6, zoom * Math.exp(-Math.max(-120, Math.min(120, delta)) * 0.002)));
    if (nextZoom === zoom) return;
    zoom = nextZoom;
    renderZoom(false, event);
  }, { passive: false });
  viewerViewport.addEventListener('dblclick', () => changeZoom('fit'));
  viewerImage.addEventListener('load', () => renderZoom(true));
  window.addEventListener('resize', () => renderZoom());
  imageViewer.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const action = event.key === '+' || event.key === '=' ? 'in' : event.key === '-' ? 'out' : event.key === '0' ? 'fit' : null;
    if (action) { event.preventDefault(); changeZoom(action); }
  });
  viewerViewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || zoom <= 1) return;
    event.preventDefault();
    viewerViewport.focus({ preventScroll: true });
    drag = { x: event.clientX, y: event.clientY, left: viewerViewport.scrollLeft, top: viewerViewport.scrollTop };
    viewerViewport.setPointerCapture(event.pointerId);
    viewerViewport.classList.add('is-dragging');
  });
  viewerViewport.addEventListener('pointermove', event => {
    if (!drag) return;
    viewerViewport.scrollLeft = drag.left - (event.clientX - drag.x);
    viewerViewport.scrollTop = drag.top - (event.clientY - drag.y);
  });
  function endDrag() { drag = null; viewerViewport.classList.remove('is-dragging'); }
  viewerViewport.addEventListener('pointerup', endDrag);
  viewerViewport.addEventListener('pointercancel', endDrag);
  viewerViewport.addEventListener('lostpointercapture', endDrag);

  document.querySelectorAll('.project-image').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      // Keep normal link behaviour for modified clicks and browsers without dialogs.
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !imageViewer.showModal) return;
      event.preventDefault();
      const image = link.querySelector('img');
      imageTrigger = link;
      viewerImage.src = link.href;
      viewerImage.alt = image.alt;
      zoom = 1;
      viewerCaption.textContent = link.closest('figure').querySelector('figcaption').textContent;
      imageViewer.showModal();
      document.body.classList.add('image-viewer-open');
      requestAnimationFrame(() => renderZoom(true));
    });
  });

  imageViewer.querySelector('.image-viewer-close').addEventListener('click', () => imageViewer.close());
  imageViewer.addEventListener('close', () => {
    endDrag();
    document.body.classList.remove('image-viewer-open');
    if (imageTrigger && !imageTrigger.closest('.page').hidden) {
      imageTrigger.focus({ preventScroll: true });
    }
  });
  imageViewer.addEventListener('click', event => {
    const bounds = imageViewer.getBoundingClientRect();
    if (event.target === imageViewer &&
      (event.clientX < bounds.left || event.clientX > bounds.right ||
       event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      imageViewer.close();
    }
  });

  function render(moveFocus = false) {
    if (imageViewer.open) imageViewer.close();
    const id = location.hash.slice(1) || 'about';

    if (id === 'content') {
      main.focus();
      return;
    }

    const current = pages.find(page => page.id === id) || home;

    pages.forEach(page => {
      page.hidden = page !== current;
    });

    document.querySelectorAll('.site-header nav a[href^="#"]')
      .forEach(link => {
        const active =
          link.hash === '#' + current.id ||
          (link.hasAttribute('data-home-link') &&
            current.id !== 'direct-coil');

        if (active) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });

    document.title = 'James Bell — ' +
      (current === home
        ? 'Portfolio'
        : current.querySelector('h1').textContent);

    if (moveFocus) {
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  window.addEventListener('hashchange', () => render(true));
  render();
})();
