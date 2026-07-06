/* ============================================================
   KENI RIDES — Form handling
   Every form POSTs JSON directly to a configurable n8n webhook
   (see js/config.js). Nothing is stored locally.
   ============================================================ */
(function () {
  'use strict';

  var cfg = (window.KENI_CONFIG && window.KENI_CONFIG.webhooks) || {};

  var SUCCESS_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  function setInvalid(field, message) {
    var wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.add('invalid');
    var msg = wrap.querySelector('.error-msg');
    if (msg && message) msg.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  }

  function clearInvalid(field) {
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.remove('invalid');
    field.removeAttribute('aria-invalid');
  }

  function validate(form) {
    var firstBad = null;
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      clearInvalid(field);
      if (field.willValidate && !field.checkValidity()) {
        var msg = field.validity.valueMissing
          ? 'This field is required.'
          : field.type === 'email'
            ? 'Please enter a valid email address.'
            : 'Please check this value.';
        setInvalid(field, msg);
        if (!firstBad) firstBad = field;
      }
    });

    // Date coherence: return date after pickup date, minimum 2 days
    var pickup = form.querySelector('[name="pickupDate"]');
    var ret = form.querySelector('[name="returnDate"]');
    if (pickup && ret && pickup.value && ret.value) {
      var d1 = new Date(pickup.value);
      var d2 = new Date(ret.value);
      var days = Math.round((d2 - d1) / 86400000);
      if (days < 2) {
        setInvalid(ret, 'Minimum rental is 2 days — please choose a later return date.');
        if (!firstBad) firstBad = ret;
      }
    }

    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function showStatus(form, message) {
    var status = form.querySelector('.form-status');
    if (!status) return;
    status.textContent = message;
    status.classList.add('error');
  }

  function hideStatus(form) {
    var status = form.querySelector('.form-status');
    if (status) status.classList.remove('error');
  }

  function showSuccess(form, message) {
    var card = form.closest('.form-card') || form;
    var success = document.createElement('div');
    success.className = 'form-success';
    success.setAttribute('role', 'status');
    success.innerHTML =
      '<div class="success-icon">' + SUCCESS_ICON + '</div>' +
      '<h3>Request received</h3>' +
      '<p>' + message + '</p>';
    form.hidden = true;
    card.appendChild(success);
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.querySelectorAll('form[data-webhook]').forEach(function (form) {
    // live re-validation on blur
    form.addEventListener(
      'blur',
      function (e) {
        var f = e.target;
        if (f.matches && f.matches('input, select, textarea') && f.value) {
          if (f.checkValidity()) clearInvalid(f);
        }
      },
      true
    );

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideStatus(form);
      if (!validate(form)) return;

      var kind = form.dataset.webhook; // 'booking' | 'contact'
      var url = cfg[kind];

      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = typeof value === 'string' ? value.trim() : value;
      });
      data.type = kind;
      data.page = location.href;
      data.submittedAt = new Date().toISOString();

      var btn = form.querySelector('[type="submit"]');
      var btnHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending…';

      var successMsg =
        form.dataset.successMessage ||
        'Thank you. Our team will contact you shortly to confirm your reservation.';

      if (!url || url.indexOf('YOUR-N8N-INSTANCE') !== -1) {
        // Webhook not configured yet — surface it clearly instead of failing silently.
        btn.disabled = false;
        btn.innerHTML = btnHtml;
        showStatus(
          form,
          'The booking system is not connected yet (n8n webhook URL missing in js/config.js). Please call us or use WhatsApp.'
        );
        return;
      }

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Webhook responded with ' + res.status);
          showSuccess(form, successMsg);
        })
        .catch(function () {
          btn.disabled = false;
          btn.innerHTML = btnHtml;
          showStatus(
            form,
            'Something went wrong sending your request. Please try again, or reach us directly on WhatsApp.'
          );
        });
    });
  });

  /* ---------- Date field minimums ---------- */
  var today = new Date();
  var iso = function (d) { return d.toISOString().split('T')[0]; };
  document.querySelectorAll('input[name="pickupDate"]').forEach(function (input) {
    // 2-day notice for pickup, per rental conditions
    var min = new Date(today);
    min.setDate(min.getDate() + 2);
    input.min = iso(min);
    input.addEventListener('change', function () {
      var ret = input.form.querySelector('[name="returnDate"]');
      if (ret && input.value) {
        var d = new Date(input.value);
        d.setDate(d.getDate() + 2); // minimum 2-day rental
        ret.min = iso(d);
        if (ret.value && ret.value < ret.min) ret.value = ret.min;
      }
    });
  });
  document.querySelectorAll('input[name="returnDate"]').forEach(function (input) {
    var min = new Date(today);
    min.setDate(min.getDate() + 4);
    input.min = iso(min);
  });
})();
