(() => {
  const trackEvent = (name, params = {}) => {
    if (!name) return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params);
  };

  window.diynezaTrackEvent = trackEvent;
  const getFormId = (form) => form?.dataset?.analyticsForm || form?.id || 'unknown_form';

  window.diynezaTrackFormEvent = (eventName, form, extra = {}) => {
    if (!eventName || !form) return;
    trackEvent(eventName, {
      form_id: getFormId(form),
      page_path: window.location.pathname,
      ...extra
    });
  };

  const ctaSelector = '.btn, .btn-primary, .btn-outline';

  document.addEventListener('click', (event) => {
    const target = event.target.closest(ctaSelector);
    if (!target) return;

    if (target.closest('form')) return;

    const ctaText = (target.textContent || '').trim();
    const ctaHref = target.getAttribute('href') || '';
    let ctaArea = 'body';

    if (target.closest('nav')) {
      ctaArea = 'nav';
    } else if (target.closest('footer')) {
      ctaArea = 'footer';
    }

    const params = { page_path: window.location.pathname, cta_area: ctaArea };
    if (ctaText) params.cta_text = ctaText;
    if (ctaHref) params.cta_destination = ctaHref;

    trackEvent('cta_click', params);
  });

  const forms = document.querySelectorAll('[data-analytics-form]');
  forms.forEach((form) => {
    const fields = form.querySelectorAll('input, textarea, select');
    let started = false;

    const handleStart = () => {
      if (started) return;
      started = true;
      trackEvent('form_start', {
        form_id: getFormId(form),
        page_path: window.location.pathname
      });
    };

    fields.forEach((field) => {
      field.addEventListener('focus', handleStart);
      field.addEventListener('change', handleStart);
    });
  });
})();
