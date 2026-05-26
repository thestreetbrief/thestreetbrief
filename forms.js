// forms.js
// Handles all newsletter signup forms across the site.
// Reads config from window.TSB_CONFIG (site-config.js).

(function () {
  'use strict';

  function getConfig() {
    return (window.TSB_CONFIG || {});
  }

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('.nl-form');
    if (!form) return;
    e.preventDefault();

    var input = form.querySelector('input[type="email"]');
    if (!input) return;
    var email = (input.value || '').trim();
    if (!email || email.indexOf('@') === -1) { input.focus(); return; }

    var cfg = getConfig();
    var action = cfg.BEEHIIV_FORM_URL;
    var successMsg = cfg.NEWSLETTER_SUCCESS || "✓ You're in.";

    function showSuccess() {
      form.classList.add('nl-form--success');
      form.innerHTML = '<span>' + successMsg + '</span>';
    }

    // If Beehiiv URL isn't configured yet, just show success (design preview).
    if (!action || action === '#') {
      showSuccess();
      return;
    }

    // Real POST to Beehiiv. The response is opaque (no-cors) but the request
    // goes through. Either outcome → show success state.
    var fd = new FormData();
    fd.append('email', email);
    fetch(action, { method: 'POST', body: fd, mode: 'no-cors' })
      .then(showSuccess)
      .catch(showSuccess);
  });

  // Inquiry / application contact forms (Advertise + Management pages)
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-contact-form]');
    if (!form) return;
    e.preventDefault();
    var status = form.querySelector('[data-contact-status]');
    if (status) status.style.display = 'block';
    Array.prototype.forEach.call(
      form.querySelectorAll('input, textarea, select'),
      function (i) { if (i.type !== 'submit' && i.type !== 'button') i.value = ''; }
    );
  });
})();
