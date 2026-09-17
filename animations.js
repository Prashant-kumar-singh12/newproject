/* ============================================================
   animations.js — the visual layer
   1) Page loader        4) Pointer spotlight on cards
   2) Scroll progress    5) 3D tilt on hover
   3) Typing headline    6) Button ripple
   Everything here is decoration: if it fails, the site still
   works. Every effect is skipped when the visitor has asked
   for reduced motion.
   ============================================================ */

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Page loader ---------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    // Hide as soon as the page is ready, with a short minimum so it
    // does not flash in and out on a fast connection.
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('is-done'); }, reduced ? 0 : 420);
    });
    // Safety net: never let the loader block the page.
    setTimeout(function () { loader.classList.add('is-done'); }, 2500);
  }

  /* ---------- 2. Scroll progress bar ---------- */
  const progress = document.querySelector('.progress');
  if (progress) {
    const update = function () {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.width = percent + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 3. Typing headline ---------- */
  const typed = document.getElementById('typed');
  if (typed) {
    const words = (typed.dataset.words || '').split('|').filter(Boolean);

    if (reduced || words.length === 0) {
      typed.textContent = words[0] || '';
    } else {
      let wordIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = function () {
        const word = words[wordIndex];
        charIndex += deleting ? -1 : 1;
        typed.textContent = word.slice(0, charIndex);

        let wait = deleting ? 45 : 85;
        if (!deleting && charIndex === word.length) {
          wait = 1600;              // hold the finished word
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          wait = 350;
        }
        setTimeout(tick, wait);
      };
      tick();
    }
  }

  /* ---------- 4. Pointer spotlight on cards ---------- */
  document.querySelectorAll('.card, .quote').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - box.left) + 'px');
      card.style.setProperty('--my', (e.clientY - box.top) + 'px');
    });
  });

  /* ---------- 5. Subtle 3D tilt ---------- */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        const box = el.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width - 0.5;   // -0.5 .. 0.5
        const y = (e.clientY - box.top) / box.height - 0.5;
        el.style.transform =
          'perspective(800px) translateY(-6px) rotateX(' + (-y * 6).toFixed(2) +
          'deg) rotateY(' + (x * 6).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------- 6. Button ripple ---------- */
  document.querySelectorAll('.btn').forEach(function (button) {
    button.addEventListener('click', function (e) {
      if (reduced) return;
      const box = button.getBoundingClientRect();
      const size = Math.max(box.width, box.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - box.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - box.top - size / 2) + 'px';
      button.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 620);
    });
  });

  /* ---------- 7. Duplicate the marquee so the loop is seamless ---------- */
  const track = document.querySelector('.marquee__track');
  if (track) {
    track.innerHTML += track.innerHTML;   // two identical halves = smooth wrap
  }
})();
