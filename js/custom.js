// Custom JS for Mark Overseas

const onloadFunc = () => {
  $('.odometer').appear(function () {
    var odo = $('.odometer');
    odo.each(function () {
      var countNumber = $(this).attr('data-count');
      $(this).html(countNumber);
    });
  });
};

const preloaderFunc = () => {
  const hidePreloader = () => {
    $('#preloader, .preloader').delay(150).fadeOut(150);
  };
  // Hide as soon as the DOM is ready so pages are usable immediately,
  // without waiting for images, fonts or external scripts.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hidePreloader);
  } else {
    hidePreloader();
  }
  // Fail-safe: never keep the page blocked behind the preloader.
  setTimeout(hidePreloader, 2500);
};

preloaderFunc();

// sendQuery - submits inquiry to /api/submit (SMTP email + Firestore via Firebase)
// Falls back to WhatsApp if the API is unreachable or fields are incomplete.
async function sendQuery(e, form, product) {
  e.preventDefault();
  const fields = {};
  ['name', 'email', 'contact', 'subject', 'message', 'website_url'].forEach((k) => {
    const el = form.querySelector(`[name="${k}"]`);
    if (el) fields[k] = el.value.trim();
  });

  const msg = [
    product ? `Hi Team, I am interested in ${product}.` : 'Hi Team,',
    fields.name ? `My name is ${fields.name}.` : '',
    fields.contact ? `My contact number is ${fields.contact}.` : '',
    fields.email ? `My email is ${fields.email}.` : '',
    fields.subject ? `Subject: ${fields.subject}.` : '',
    fields.message ? `Message: ${fields.message}` : ''
  ].filter(Boolean).join('\n');
  const waUrl = `https://api.whatsapp.com/send?phone=+919978925996&text=${encodeURIComponent(msg)}`;

  // Newsletter (name + contact only) has no email -> WhatsApp keeps working
  if (!fields.email) {
    window.open(waUrl, '_blank');
    return;
  }

  const btn = form.querySelector('button[type="submit"], .contact-page__btn, button');
  const original = btn ? btn.innerHTML : '';
  if (btn) btn.disabled = true;

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fields.name || '',
        email: fields.email || '',
        phone: fields.contact || '',
        subject: product ? `Inquiry: ${product}` : (fields.subject || 'Website Inquiry'),
        message: fields.message || '',
        website_url: fields.website_url || ''
      })
    });
    const result = await response.json();

    if (result.success) {
      if (form && form.reset) form.reset();
      alert('✅ Success! Your inquiry has been sent to our team.');
    } else {
      throw new Error(result.error || 'Submission failed');
    }
  } catch (err) {
    console.error('Submission Error:', err);
    alert('⚠️ Could not reach our team directly. Opening WhatsApp instead...');
    window.open(waUrl, '_blank');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }
}