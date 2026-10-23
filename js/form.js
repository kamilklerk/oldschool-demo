// Sprawdza czy użytkownik wyraził zgodę na kategorię "advertisement" w CookieYes.
// Slug kategorii musi być zgodny z dashboardem CookieYes (domyślnie: "advertisement").
function hasCkyMarketing() {
  const match = document.cookie.split('; ')
    .find(c => c.startsWith('cookieyes-consent='));
  if (!match) return false;
  const val = decodeURIComponent(match.split('=').slice(1).join('='));
  return val.split(',').includes('advertisement:yes');
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  btn.textContent = 'Wysyłam...';
  btn.disabled = true;

  const data = {
    imie: form.imie.value,
    telefon: form.telefon.value,
    email: form.email.value,
  };

  try {
    await fetch('https://hook.eu1.make.com/ex1r5vixe7k1ppln78pmypdqlmpv726q', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (_) {}

  if (typeof fbq !== 'undefined' && hasCkyMarketing()) {
    fbq('track', 'Lead', { content_name: 'Lista oczekujących DJ PRO' });
  }

  form.style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}
