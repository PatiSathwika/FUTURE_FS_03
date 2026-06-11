/* ===========================
   THE CAPTAIN GYM – script.js
   =========================== */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // back to top
  const btn = document.getElementById('backToTop');
  if (window.scrollY > 500) btn.classList.add('visible');
  else btn.classList.remove('visible');
});

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { passive: true });

// ---- BMI CALCULATOR ----
function calculateBMI() {
  const height = parseFloat(document.getElementById('bmiHeight').value);
  const weight = parseFloat(document.getElementById('bmiWeight').value);

  if (!height || !weight || height < 100 || height > 250 || weight < 30 || weight > 300) {
    showBMIError();
    return;
  }

  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);
  const bmiNum = parseFloat(bmi);

  let category, advice, color, markerPct;

  if (bmiNum < 18.5) {
    category = 'Underweight';
    advice = 'You are below a healthy weight range. Consider a muscle-building and nutrition program to gain healthy mass.';
    color = '#4a90d9';
    markerPct = Math.min((bmiNum / 18.5) * 25, 24);
  } else if (bmiNum < 25) {
    category = 'Healthy Weight';
    advice = 'Great! You are in a healthy weight range. Keep up your fitness routine to maintain your results.';
    color = '#27a850';
    markerPct = 25 + ((bmiNum - 18.5) / (25 - 18.5)) * 25;
  } else if (bmiNum < 30) {
    category = 'Overweight';
    advice = 'You are slightly above the healthy range. A structured fat loss program and diet plan can help you reach your goal.';
    color = '#f0a500';
    markerPct = 50 + ((bmiNum - 25) / (30 - 25)) * 25;
  } else {
    category = 'Obese';
    advice = 'You are in the obese range. Our trainers can guide you with a safe, effective program designed just for you.';
    color = '#d62828';
    markerPct = Math.min(75 + ((bmiNum - 30) / 10) * 25, 96);
  }

  // Display result
  const resultDiv = document.getElementById('bmiResult');
  const scaleDiv = document.getElementById('bmiScaleDisplay');
  resultDiv.style.display = 'flex';
  scaleDiv.style.display = 'block';

  // Animate number
  const bmiNumberEl = document.getElementById('bmiNumber');
  animateNumber(bmiNumberEl, 0, bmiNum, 1000);

  document.getElementById('bmiCategory').textContent = category;
  document.getElementById('bmiCategory').style.color = color;
  document.getElementById('bmiAdvice').textContent = advice;

  // Ring color
  document.querySelector('.bmi-score-ring').style.borderColor = color;
  document.querySelector('.bmi-score-ring').style.boxShadow = `0 0 40px ${color}40`;

  // Scale marker
  setTimeout(() => {
    document.getElementById('scaleMarker').style.left = `${markerPct}%`;
  }, 200);

  // Smooth scroll to result
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showBMIError() {
  const hInput = document.getElementById('bmiHeight');
  const wInput = document.getElementById('bmiWeight');
  [hInput, wInput].forEach(el => {
    el.style.borderColor = '#d62828';
    setTimeout(() => el.style.borderColor = '', 2000);
  });
}

function animateNumber(el, from, to, duration) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (from + (to - from) * eased).toFixed(1);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Allow Enter key in BMI fields
['bmiHeight', 'bmiWeight', 'bmiAge', 'bmiGender'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') calculateBMI();
    });
  }
});

// ---- TESTIMONIALS SLIDER ----
let currentSlide = 0;
const track = document.getElementById('testimonialsTrack');
const totalCards = track ? track.children.length : 0;
let visibleCards = getVisibleCards();
let autoSlideTimer;

function getVisibleCards() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function initDots() {
  const dotsEl = document.getElementById('tcDots');
  if (!dotsEl) return;
  const maxSlide = totalCards - visibleCards;
  dotsEl.innerHTML = '';
  for (let i = 0; i <= maxSlide; i++) {
    const dot = document.createElement('div');
    dot.className = 'tc-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(dot);
  }
}

function goToSlide(n) {
  visibleCards = getVisibleCards();
  const maxSlide = totalCards - visibleCards;
  currentSlide = Math.max(0, Math.min(n, maxSlide));
  const cardWidth = track.children[0] ? track.children[0].offsetWidth + 24 : 0;
  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  document.querySelectorAll('.tc-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function slideTestimonials(dir) {
  goToSlide(currentSlide + dir);
  resetAutoSlide();
}

function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    const maxSlide = totalCards - getVisibleCards();
    goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
  }, 4500);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

if (track) {
  initDots();
  startAutoSlide();
  window.addEventListener('resize', () => {
    visibleCards = getVisibleCards();
    initDots();
    goToSlide(0);
  });
}

// ---- FAQ ----
function toggleFAQ(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  // Toggle this
  if (!wasOpen) item.classList.add('open');
}

// ---- CONTACT FORM ----


// ---- HERO: Stagger title lines on load ----
window.addEventListener('load', () => {
  const lines = document.querySelectorAll('.title-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(40px)';
    line.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    line.style.transitionDelay = `${0.2 + i * 0.15}s`;
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 100);
  });

  // Hero sub-elements
  document.querySelectorAll('.hero-content .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${0.7 + i * 0.18}s`;
    el.classList.add('visible');
  });
});

// ---- SMOOTH ANCHOR SCROLLING (offset for sticky nav) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- GALLERY LIGHTBOX (simple) ----
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;
      display:flex;align-items:center;justify-content:center;cursor:pointer;
      animation:fadeIn 0.3s ease;
    `;
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;box-shadow:0 0 60px rgba(0,0,0,0.8);';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      position:absolute;top:20px;right:28px;background:none;border:none;
      color:white;font-size:2.5rem;cursor:pointer;line-height:1;
    `;
    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    const close = () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  });
});

// ---- COUNTER ANIMATION for stats ----
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          animateCounter(el, 0, target, suffix, 1500);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

function animateCounter(el, from, to, suffix, duration) {
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(from + (to - from) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ---- NAV active style ----
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--gold) !important; }`;
document.head.appendChild(style);