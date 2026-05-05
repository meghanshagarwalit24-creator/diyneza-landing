(() => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  const trackEvent = (name, params = {}) => {
    if (!name) return;
    window.gtag('event', name, params);
  };

  window.diynezaTrackEvent = trackEvent;

  const ctaSelector = '.btn, .btn-primary, .btn-outline';

  document.addEventListener('click', (event) => {
    const target = event.target.closest(ctaSelector);
    if (!target) return;

    const isFormSubmit = target.closest('form') && (target.tagName === 'BUTTON' || target.getAttribute('type') === 'submit');
    if (isFormSubmit) return;

    const ctaText = (target.textContent || '').trim();
    const ctaHref = target.getAttribute('href') || '';
    let ctaArea = 'body';

    if (target.closest('nav')) ctaArea = 'nav';
    if (target.closest('footer')) ctaArea = 'footer';

    const params = { page_path: window.location.pathname, cta_area: ctaArea };
    if (ctaText) params.cta_text = ctaText;
    if (ctaHref) params.cta_destination = ctaHref;

    trackEvent('cta_click', params);
  });

  const form = document.getElementById('submit-to-google-sheet');
  if (form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let started = false;

    const handleStart = () => {
      if (started) return;
      started = true;
      trackEvent('form_start', {
        form_id: form.id || 'lead_form',
        page_path: window.location.pathname
      });
    };

    fields.forEach((field) => {
      field.addEventListener('focus', handleStart, { once: true });
      field.addEventListener('change', handleStart, { once: true });
    });
  }
})();
