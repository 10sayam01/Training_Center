/* ═══════════════════════════════════════════════════
   IAS – IT Academy & Solutions | script.js
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────
     1. STICKY NAVBAR + SCROLL ACTIVE LINKS
  ─────────────────────────────────────────*/
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Scrolled style
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Active link based on scroll position
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  /* ────────────────────────────────────────
     2. HAMBURGER MOBILE MENU
  ─────────────────────────────────────────*/
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });


  /* ────────────────────────────────────────
     3. SMOOTH SCROLLING (anchor links)
  ─────────────────────────────────────────*/
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ────────────────────────────────────────
     4. SCROLL-REVEAL: COURSE CARDS
  ─────────────────────────────────────────*/
  const cards = document.querySelectorAll('.course-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const delay = (parseInt(card.dataset.index || 0) - 1) * 100;
        setTimeout(() => card.classList.add('visible'), delay);
        revealObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => revealObserver.observe(card));


  /* ────────────────────────────────────────
     5. BACK-TO-TOP BUTTON
  ─────────────────────────────────────────*/
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ────────────────────────────────────────
     6. CONTACT FORM VALIDATION
  ─────────────────────────────────────────*/
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const fields = {
    fname:  { el: document.getElementById('fname'),   err: document.getElementById('fnameErr'),   rule: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    email:  { el: document.getElementById('email'),   err: document.getElementById('emailErr'),   rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    phone:  { el: document.getElementById('phone'),   err: document.getElementById('phoneErr'),   rule: v => /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.' },
    course: { el: document.getElementById('course'),  err: document.getElementById('courseErr'),  rule: v => v ? '' : 'Please select a course.' },
  };

  // Real-time validation
  Object.values(fields).forEach(({ el, err, rule }) => {
    el.addEventListener('blur', () => {
      const msg = rule(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const msg = rule(el.value);
        err.textContent = msg;
        el.classList.toggle('error', !!msg);
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ el, err, rule }) => {
      const msg = rule(el.value);
      err.textContent = msg;
      el.classList.toggle('error', !!msg);
      if (msg) valid = false;
    });

    if (!valid) return;

    // Simulate submission
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1400);
  });


  /* ────────────────────────────────────────
     7. ANIMATED STAT COUNTER (HERO)
  ─────────────────────────────────────────*/
  function animateCounter(el, end, duration = 1500) {
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * end);
      el.textContent = end === 100 ? current + '%' : current + (el.dataset.suffix || '+');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const heroSection = document.querySelector('.hero');
  let countersStarted = false;

  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat strong').forEach(el => {
        const text  = el.textContent.trim();
        const raw   = parseInt(text.replace(/\D/g,''));
        el.dataset.suffix = text.includes('%') ? '' : '+';
        animateCounter(el, raw, 1600);
      });
    }
  }, { threshold: 0.5 });

  if (heroSection) heroObserver.observe(heroSection);

}); // end DOMContentLoaded
