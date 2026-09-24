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

// ResponsiveImageManager - keeps img srcset/sizes matched to the actual rendered
// size so only the pixels currently on screen are downloaded. On page zoom
// (browser or pinch) the next larger srcset tier is loaded automatically instead
// of re-downloading the full image.
const responsiveImageManager = () => {
  const setSizes = (root) => {
    (root || document).querySelectorAll('img[srcset]').forEach((img) => {
      const w = img.clientWidth;
      if (!w) return;
      img.sizes = Math.ceil(w) + 'px';
    });
  };
  const schedule = () => {
    clearTimeout(_rimTimer);
    _rimTimer = setTimeout(() => setSizes(), 120);
  };
  let _rimTimer;
  setSizes();
  window.addEventListener('resize', schedule);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', schedule);
    window.visualViewport.addEventListener('scroll', schedule);
  }
  window.addEventListener('load', () => setSizes());
  setTimeout(() => setSizes(), 600);
  return setSizes;
};
const refreshImageSizes = responsiveImageManager();

// SequentialContentLoader - page content loads in order automatically.
// First blocks are visible immediately; each following block appears on a
// timer (no scrolling needed) until the whole page is loaded top-to-bottom.
const sequentialContentLoader = () => {
  const wrapper = document.querySelector('.page-wrapper');
  if (!wrapper) return;

  const hasSliderOrCarousel = (el) =>
    !!el.querySelector('[class*="carousel"], [class*="swiper"], [class*="slider"], .owl-carousel, .main-slider');

  let units = Array.from(wrapper.querySelectorAll('.row')).filter((r) =>
    !r.closest('.main-header, .site-footer') && !hasSliderOrCarousel(r)
  );

  if (units.length < 2) {
    units = Array.from(wrapper.children).filter((el) => {
      if (el.nodeType !== 1 || !el.children.length) return false;
      if (el.closest('.main-header, .site-footer')) return false;
      if (!el.matches('section, .container, main')) return false;
      return !hasSliderOrCarousel(el);
    });
  }

  if (units.length < 2) return;

  const styleEl = document.createElement('style');
  styleEl.textContent = '.rk-loading-pending { display: none; }';
  document.head.appendChild(styleEl);

  const settleBlock = (unit) => {
    unit.querySelectorAll('.wow, .animated, [data-wow-delay]').forEach((el) => {
      el.classList.remove('wow', 'animated');
      el.style.visibility = 'visible';
      el.style.animationName = 'none';
      el.style.animationDelay = '';
      el.style.animationDuration = '';
    });
    unit.querySelectorAll('img').forEach((img) => {
      img.loading = 'lazy';
      img.decoding = 'async';
    });
    requestAnimationFrame(() => refreshImageSizes(unit));
  };

  const INITIAL_VISIBLE = 2;
  const STEP_MS = 500;

  units.forEach((unit, i) => {
    if (i >= INITIAL_VISIBLE) {
      unit.classList.add('rk-loading-pending');
      settleBlock(unit);
    }
  });

  let next = INITIAL_VISIBLE;
  const timer = setInterval(() => {
    if (next >= units.length) {
      clearInterval(timer);
      return;
    }
    const unit = units[next++];
    unit.classList.remove('rk-loading-pending');
    settleBlock(unit);
  }, STEP_MS);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', sequentialContentLoader);
} else {
  sequentialContentLoader();
}

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