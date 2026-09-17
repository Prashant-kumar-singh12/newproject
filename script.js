/* ============================================================
   script.js — site-wide interactions
   1) Mobile navigation      5) Animated counters
   2) Sticky navbar state    6) Back to top
   3) Smooth scrolling       7) Password show / hide
   4) Scroll reveal          8) Forms (contact, login, signup)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Mobile navigation ---------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Tapping any link closes the menu again.
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Escape closes the menu and returns focus to the button.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- 2. Sticky navbar gets a border once scrolled ---------- */
  const nav = document.querySelector('.nav');
  const toTop = document.querySelector('.to-top');

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Smooth scrolling for same-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- 4. Scroll reveal with IntersectionObserver ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (el, i) {
      // A small stagger makes grids feel alive without being slow.
      el.style.animationDelay = (i % 4) * 70 + 'ms';
      revealObserver.observe(el);
    });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 5. Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out so the number settles instead of stopping abruptly.
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* ---------- 6. Back to top ---------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 7. Password show / hide ---------- */
  document.querySelectorAll('.pw-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;
      const hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      button.textContent = hidden ? 'Hide' : 'Show';
      button.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
      input.focus();
    });
  });

  /* ---------- 8a. Service cards: Learn more ---------- */
  document.querySelectorAll('[data-more]').forEach(function (button) {
    button.addEventListener('click', function () {
      const panel = document.getElementById(button.dataset.more);
      if (!panel) return;
      const open = panel.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.textContent = open ? 'Show less' : 'Learn more';
    });
  });

  /* ---------- helper: show an alert box ---------- */
  function announce(box, message, kind) {
    if (!box) return;
    box.textContent = message;
    box.className = 'alert alert--' + kind + ' is-visible';
  }

  /* ---------- 8b. Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    Validate.liveClear(contactForm);

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const box = document.getElementById('contactAlert');
      const f = contactForm.elements;

      const valid = Validate.run(contactForm, [
        { input: f.name, check: function () { return Validate.name(f.name.value); } },
        { input: f.email, check: function () { return Validate.email(f.email.value); } },
        { input: f.phone, check: function () { return Validate.phone(f.phone.value); } },
        { input: f.subject, check: function () { return Validate.minLength(f.subject.value, 4, 'a subject'); } },
        { input: f.message, check: function () { return Validate.minLength(f.message.value, 15, 'a message'); } }
      ]);

      if (!valid) {
        announce(box, 'Please fix the highlighted fields and send again.', 'err');
        return;
      }

      // BACKEND HOOK: POST this object to /api/contact and mail it.
      const enquiry = {
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        subject: f.subject.value.trim(),
        message: f.message.value.trim(),
        sentAt: new Date().toISOString()
      };
      try {
        const inbox = JSON.parse(localStorage.getItem('internlink_messages')) || [];
        inbox.push(enquiry);
        localStorage.setItem('internlink_messages', JSON.stringify(inbox));
      } catch (err) {
        console.warn('Could not store the message locally:', err);
      }

      announce(box, 'Thanks, ' + enquiry.name.split(' ')[0] + '. Your message is in — we reply within one working day.', 'ok');
      contactForm.reset();
    });
  }

  /* ---------- 8c. Signup form ---------- */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    Validate.liveClear(signupForm);

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const box = document.getElementById('signupAlert');
      const f = signupForm.elements;

      const valid = Validate.run(signupForm, [
        { input: f.name, check: function () { return Validate.name(f.name.value); } },
        { input: f.email, check: function () { return Validate.email(f.email.value); } },
        { input: f.password, check: function () { return Validate.password(f.password.value); } },
        { input: f.confirm, check: function () { return Validate.confirmPassword(f.confirm.value, f.password.value); } }
      ]);

      if (!valid) {
        announce(box, 'Please fix the highlighted fields.', 'err');
        return;
      }

      const result = Auth.signup(f.name.value, f.email.value, f.password.value);
      announce(box, result.message, result.ok ? 'ok' : 'err');

      if (result.ok) {
        signupForm.reset();
        setTimeout(function () { window.location.href = 'login.html'; }, 1400);
      }
    });
  }

  /* ---------- 8d. Login form + demo dashboard ---------- */
  const loginForm = document.getElementById('loginForm');
  const dashboard = document.getElementById('dashboard');
  const loginPanel = document.getElementById('loginPanel');

  function showDashboard() {
    const user = Auth.currentUser();
    if (!user || !dashboard) return;
    const nameSlot = document.getElementById('dashName');
    const emailSlot = document.getElementById('dashEmail');
    if (nameSlot) nameSlot.textContent = user.name;
    if (emailSlot) emailSlot.textContent = user.email;
    dashboard.classList.add('is-visible');
    if (loginPanel) loginPanel.style.display = 'none';
  }

  if (loginForm) {
    Validate.liveClear(loginForm);

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const box = document.getElementById('loginAlert');
      const f = loginForm.elements;

      const valid = Validate.run(loginForm, [
        { input: f.email, check: function () { return Validate.email(f.email.value); } },
        { input: f.password, check: function () { return Validate.required(f.password.value, 'your password'); } }
      ]);

      if (!valid) {
        announce(box, 'Please fix the highlighted fields.', 'err');
        return;
      }

      const result = Auth.login(f.email.value, f.password.value);
      announce(box, result.message, result.ok ? 'ok' : 'err');

      if (result.ok) {
        loginForm.reset();
        Auth.renderNav();
        setTimeout(showDashboard, 700);
      }
    });
  }

  // Already signed in? Skip the form and show the dashboard.
  if (dashboard && Auth.isSignedIn()) showDashboard();

  /* ---------- 8e. Logout buttons ---------- */
  document.querySelectorAll('[data-logout]').forEach(function (button) {
    button.addEventListener('click', function () {
      Auth.logout();
      if (dashboard) {
        dashboard.classList.remove('is-visible');
        if (loginPanel) loginPanel.style.display = '';
        const box = document.getElementById('loginAlert');
        announce(box, 'You are signed out. See you soon.', 'ok');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = 'login.html';
      }
    });
  });

  /* ---------- Keep the navbar in sync with the session ---------- */
  Auth.renderNav();

  /* ---------- Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
