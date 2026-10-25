function toggleOpinie(btn) {
  btn.classList.toggle('open');
  document.getElementById('social-proof-grid').classList.toggle('open');
}
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

function toggleIndywidualny(toggle) {
  const content = toggle.nextElementSibling;
  toggle.classList.toggle('open');
  content.classList.toggle('open');
}

// Hide sticky CTA near contact section
(function() {
  const stickyCta = document.getElementById('sticky-cta');
  const kontakt = document.getElementById('kontakt');
  if (!stickyCta || !kontakt) return;
  const obs = new IntersectionObserver(entries => {
    stickyCta.style.display = entries[0].isIntersecting ? 'none' : '';
  }, { threshold: 0.1 });
  obs.observe(kontakt);
})();

// Snap scroll dla pierwszych 3 sekcji
(function() {
  const snapSecs = ['#hero', '.vision-section', '.photo-caption-section']
    .map(s => document.querySelector(s)).filter(Boolean);
  if (!snapSecs.length) return;

  let locked = false;

  function getSnapIndex() {
    for (let i = snapSecs.length - 1; i >= 0; i--) {
      if (snapSecs[i].getBoundingClientRect().top <= 50) return i;
    }
    return 0;
  }

  function inSnapZone() {
    const lastBottom = snapSecs[snapSecs.length - 1].getBoundingClientRect().bottom;
    return lastBottom > window.innerHeight * 0.4;
  }

  window.addEventListener('wheel', function(e) {
    if (!inSnapZone()) return;
    if (locked) { e.preventDefault(); return; }
    const idx = getSnapIndex();
    const goNext = e.deltaY > 0;
    const target = goNext ? snapSecs[idx + 1] : snapSecs[idx - 1];
    if (!target) return;
    e.preventDefault();
    locked = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { locked = false; }, 900);
  }, { passive: false });

  let touchStartY = 0;
  window.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', function(e) {
    if (!inSnapZone() || locked) return;
    const delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 30) return;
    const idx = getSnapIndex();
    const target = delta > 0 ? snapSecs[idx + 1] : snapSecs[idx - 1];
    if (!target) return;
    locked = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { locked = false; }, 900);
  }, { passive: true });
})();

// Hamburger menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// YouTube consent management
// CookieYes API: getCkyConsent(), revisitCkyConsent(), event "cookieyes_consent_update"
// Kategoria reklamowa w tym koncie CookieYes: slug "advertisement"
function getCkyAdvertisementConsent() {
  if (typeof window.getCkyConsent === 'function') {
    const c = window.getCkyConsent();
    return !!(c.categories && c.categories.advertisement === true);
  }
  // Fallback: parsowanie cookie (gdy getCkyConsent niedostępne, np. w testach)
  const match = document.cookie.split('; ')
    .find(c => c.startsWith('cookieyes-consent='));
  if (!match) return false;
  const val = decodeURIComponent(match.split('=').slice(1).join('='));
  return val.split(',').includes('advertisement:yes');
}

function updateYouTubeEmbed(hasConsent) {
  const placeholder = document.getElementById('yt-placeholder');
  const iframe = document.getElementById('yt-iframe');
  if (!placeholder || !iframe) return;
  if (hasConsent) {
    placeholder.style.display = 'none';
    if (!iframe.getAttribute('src') && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
    iframe.style.display = '';
  } else {
    placeholder.style.display = '';
    iframe.removeAttribute('src');
    iframe.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateYouTubeEmbed(getCkyAdvertisementConsent());
});

// Rzeczywista nazwa zdarzenia CookieYes: "cookieyes_consent_update"
// Detail: { accepted: ['necessary','advertisement',...], rejected: [...] }
document.addEventListener('cookieyes_consent_update', function(event) {
  const accepted = event.detail && event.detail.accepted;
  updateYouTubeEmbed(Array.isArray(accepted) && accepted.includes('advertisement'));
});
