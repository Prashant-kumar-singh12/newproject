/* ============================================================
   validation.js — reusable form validation helpers
   Every form on the site (contact, login, signup) uses these
   functions so the rules and error styling stay consistent.
   ============================================================ */

const Validate = (function () {
  // --- Rules -------------------------------------------------
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  // Accepts 10-digit Indian numbers, with optional +91 / 0 prefix,
  // and allows spaces or dashes between groups.
  const PHONE_RE = /^(\+?\d{1,3}[\s-]?)?[6-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}$/;

  /** Show an error message under a field and mark it invalid. */
  function showError(input, message) {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.add('has-error');
    const slot = field.querySelector('.error');
    if (slot) slot.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  /** Clear the error state of a single field. */
  function clearError(input) {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.remove('has-error');
    const slot = field.querySelector('.error');
    if (slot) slot.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  /** Clear every error inside a form. */
  function clearForm(form) {
    form.querySelectorAll('.field').forEach(function (field) {
      field.classList.remove('has-error');
      const slot = field.querySelector('.error');
      if (slot) slot.textContent = '';
    });
    form.querySelectorAll('[aria-invalid]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  // --- Individual checks ------------------------------------
  // Each check returns an error string, or '' when the value is fine.

  function name(value) {
    const v = value.trim();
    if (!v) return 'Enter your full name.';
    if (v.length < 3) return 'Name must be at least 3 characters.';
    if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(v)) return 'Use letters only.';
    return '';
  }

  function email(value) {
    const v = value.trim();
    if (!v) return 'Enter your email address.';
    if (!EMAIL_RE.test(v)) return 'Enter a valid email, like you@example.com.';
    return '';
  }

  function phone(value) {
    const v = value.trim();
    if (!v) return 'Enter your phone number.';
    if (!PHONE_RE.test(v)) return 'Enter a valid 10-digit mobile number.';
    return '';
  }

  function required(value, label) {
    if (!value.trim()) return 'Enter ' + label + '.';
    return '';
  }

  function minLength(value, min, label) {
    if (!value.trim()) return 'Enter ' + label + '.';
    if (value.trim().length < min) return label + ' must be at least ' + min + ' characters.';
    return '';
  }

  function password(value) {
    if (!value) return 'Enter a password.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Use at least one letter and one number.';
    return '';
  }

  function confirmPassword(value, original) {
    if (!value) return 'Re-enter your password.';
    if (value !== original) return 'Passwords do not match.';
    return '';
  }

  /**
   * Run a set of checks over a form.
   * rules = [{ input: HTMLElement, check: () => 'error or empty string' }]
   * Returns true when everything passes, and focuses the first bad field.
   */
  function run(form, rules) {
    clearForm(form);
    let firstBad = null;

    rules.forEach(function (rule) {
      const message = rule.check();
      if (message) {
        showError(rule.input, message);
        if (!firstBad) firstBad = rule.input;
      }
    });

    if (firstBad) {
      firstBad.focus();
      return false;
    }
    return true;
  }

  /** Clear a field's error as soon as the user starts fixing it. */
  function liveClear(form) {
    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () { clearError(input); });
    });
  }

  return {
    name: name,
    email: email,
    phone: phone,
    required: required,
    minLength: minLength,
    password: password,
    confirmPassword: confirmPassword,
    run: run,
    showError: showError,
    clearError: clearError,
    clearForm: clearForm,
    liveClear: liveClear
  };
})();
