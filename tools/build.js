const fs = require('fs');
const path = require('path');

const data = require('../data/site-data.json');
const ROOT = path.join(__dirname, '..');

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const site = data.site;
const nav = data.nav;
const drop = data.productsDropdown;
const markets = data.markets;

/* ---------------------------------- HEAD ---------------------------------- */
function head({ title, desc, keywords }) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${esc(desc || site.description)}" />
  <meta name="keywords" content="${esc(keywords || 'agro commodities exporter, indian spices supplier, oil seeds export, grains and pulses india, animal feed exporter gujarat, mark overseas rajkot, sesame seeds exporter, cumin seeds supplier')}" />
  <meta name="robot" content="index, follow" />
  <meta name="googlebot" content="index, follow" />
  <meta name="bingbot" content="index, follow" />
  <meta name="author" content="${esc(site.name)}" />
  <meta name="rating" content="general" />
  <meta name="revisit-after" content="daily" />
  <meta name="google-site-verification" content="" />
  <!-- ======== Page title ============ -->
  <title>${esc(title)}</title>
  <link rel="shortcut icon" type="image/x-icon" href="images/favicons/favicon-32x32.png" title="${esc(site.name)}" />
  <!-- fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com/" />
  <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&amp;display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="chioary/assets/css/bootstrap.min.css" />
  <link rel="stylesheet" href="chioary/assets/css/animate.min.css" />
  <link rel="stylesheet" href="chioary/assets/css/custom-animate.css" />
  <link rel="stylesheet" href="chioary/assets/css/swiper.min.css" />
  <link rel="stylesheet" href="chioary/assets/css/font-awesome-all.css" />
  <link rel="stylesheet" href="chioary/assets/css/jarallax.css" />
  <link rel="stylesheet" href="chioary/assets/css/jquery.magnific-popup.css" />
  <link rel="stylesheet" href="chioary/assets/css/odometer.min.css" />
  <link rel="stylesheet" href="chioary/assets/css/flaticon.css" />
  <link rel="stylesheet" href="chioary/assets/css/owl.carousel.min.css" />
  <link rel="stylesheet" href="chioary/assets/css/owl.theme.default.min.css" />
  <link rel="stylesheet" href="chioary/assets/css/nice-select.css" />
  <link rel="stylesheet" href="chioary/assets/css/jquery-ui.css" />
  <link rel="stylesheet" href="chioary/assets/css/vegas.min.css" />
  <link rel="stylesheet" href="chioary/assets/css/aos.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/model.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/donation.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/slider.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/footer.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/coming-soon.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/services.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/about.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/counter.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/courses.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/event.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/video.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/become-volunteer.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/team.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/testimonial.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/faq.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/blog.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/newsletter.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/page-header.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/404.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/contact.css" />
  <link rel="stylesheet" href="chioary/assets/css/module-css/google-map.css" />

  <!-- template styles -->
  <link rel="stylesheet" href="chioary/assets/css/style.css" />
  <link rel="stylesheet" href="chioary/assets/css/responsive.css" />
  <link rel="stylesheet" href="chioary/assets/css/language-selector.css" />
</head>
`;
}

/* ------------------------------ HEADER / NAV ------------------------------ */
function header(active) {
  const navLink = (item) => {
    const isActive = active === item.href.split('.')[0] || (active === 'index' && item.href === 'index.html');
    return `<li${isActive ? ' class="current"' : ''}>
      <a href="${item.href}">${esc(item.label)}</a>
    </li>`;
  };

  const dropdown = `<li class="dropdown">
      <a href="our-products.html">Our Products</a>
      <ul class="shadow-box">
        ${drop.map((d) => `<li><a href="${d.href}">${esc(d.label)}</a></li>`).join('\n        ')}
        <li><a href="our-products.html">View All Products</a></li>
      </ul>
    </li>`;

  const navItems = nav
    .filter((item) => item.label !== 'Our Products')
    .map(navLink)
    .join('\n                      ');

  // insert dropdown in place of Our Products position
  const prodIndex = nav.findIndex((item) => item.label === 'Our Products');
  const allItems = [];
  nav.forEach((item, i) => {
    if (item.label === 'Our Products') return;
    if (prodIndex >= 0 && i === prodIndex + 1) allItems.push(dropdown);
    allItems.push(navLink(item));
  });
  if (prodIndex === nav.length - 1) allItems.push(dropdown);

  return `<body class="custom-cursor">
    <div class="custom-cursor__cursor"></div>
    <div class="custom-cursor__cursor-two"></div>

    <div class="preloader">
      <div class="preloader__image"></div>
    </div>
    <!-- /.preloader -->

    <div class="page-wrapper">
      <header class="main-header">
        <nav class="main-menu">
          <div class="main-menu__wrapper">
            <div class="container">
              <div class="main-menu__wrapper-inner">
                <div class="main-menu__left">
                  <div class="main-menu__logo">
                    <a href="index.html"><img src="images/mark-logo.png" style="width:auto;height:60px;" alt="Mark Overseas" /></a>
                  </div>
                  <div class="main-menu__main-menu-box">
                    <a href="#" class="mobile-nav__toggler"><i class="fa fa-bars"></i></a>
                    <ul class="main-menu__list">
                      ${allItems.join('\n                      ')}
                      <li class="language-selector"><a href="#" id="lang-selector-btn"><img src="images/translator-logo.png" alt="Translate" style="width:20px;height:20px;margin-right:7px;vertical-align:middle;" />Translate</a></li>
                    </ul>
                  </div>
                </div>
                <div class="main-menu__right">
                  <div class="main-menu__btn-box">
                    <a href="contact-us.html" class="main-menu__btn thm-btn"><span>Get A Quote</span><i class="icon-arrow-up"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div class="stricky-header stricked-menu main-menu">
        <div class="sticky-header__content"></div>
        <!-- /.sticky-header__content -->
      </div>
      <!-- /.stricky-header -->
`;
}

/* ------------------------------ FOOTER ------------------------------ */
function footer() {
  return `
      <!--Site Footer Three Start-->
      <footer class="site-footer site-footer-three">
        <div class="site-footer-three__bg" style="
          background-image: url(chioary/assets/images/shapes/page-header-bg-shape.png);
        "></div>
        <div class="site-footer-three__shape-1 float-bob-y">
          <img src="chioary/assets/images/shapes/site-footer-three-shape-1.png" alt="" />
        </div>
        <div class="site-footer__top">
          <div class="container">
            <div class="site-footer__top-inner py-5">
              <div class="row">
                <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="100ms">
                  <div class="footer-widget__about">
                    <div class="footer-widget__about-logo">
                      <a href="index.html"><img src="images/mark-logo.png" style="width:13rem;" alt="Mark Overseas" /></a>
                    </div>
                    <p class="footer-widget__about-text pb-4">
                      Mark Overseas is a prominent Export-Import Representative company specialized in agricultural
                      commodities, serving as a bridge between international buyers and global suppliers.
                    </p>
                    <div class="site-footer__social">
                      <a href="https://api.whatsapp.com/send?phone=${site.phone}&text=Hi%20Team" target="_blank"><i class="fab fa-whatsapp"></i></a>
                      <a href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                      <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                      <a href="https://twitter.com/" target="_blank"><i class="fab fa-twitter"></i></a>
                      <a href="https://www.linkedin.com/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                      <a href="https://www.youtube.com/" target="_blank"><i class="fab fa-youtube"></i></a>
                      <a href="mailto:${site.email}" target="_blank"><i class="fas fa-envelope"></i></a>
                    </div>
                  </div>
                </div>
                <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="200ms">
                  <div class="footer-widget__links">
                    <p class="footer-widget__title">Quick links</p>
                    <ul class="footer-widget__links-list list-unstyled">
                      <li><a href="index.html">Home</a></li>
                      <li><a href="about-us.html">About Us</a></li>
                      <li><a href="our-products.html">Our Products</a></li>
                      <li><a href="exports.html">Exports</a></li>
                      <li><a href="industries-we-serve.html">Industries We Serve</a></li>
                      <li><a href="certificates.html">Certificates</a></li>
                      <li><a href="market-area.html">Market Area</a></li>
                      <li><a href="contact-us.html">Contact Us</a></li>
                    </ul>
                  </div>
                </div>
                <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="300ms">
                  <div class="footer-widget__services">
                    <p class="footer-widget__title">Products</p>
                    <ul class="footer-widget__links-list list-unstyled">
                      ${drop.map((d) => `<li><a href="${d.href}">${esc(d.label)}</a></li>`).join('\n                      ')}
                    </ul>
                  </div>
                </div>
                <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="300ms">
                  <div class="footer-widget__services">
                    <p class="footer-widget__title">Our Products</p>
                    <ul class="footer-widget__links-list list-unstyled">
                      <li><a href="product-sesame.html">Sesame Seeds</a></li>
                      <li><a href="product-cumin.html">Cumin Seeds</a></li>
                      <li><a href="product-groundnut.html">Groundnut</a></li>
                      <li><a href="product-turmeric.html">Turmeric</a></li>
                      <li><a href="product-rice.html">Rice</a></li>
                      <li><a href="product-soya-de-oiled-cake.html">Soya De Oiled Cake</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="site-footer__middle">
          <div class="container-fluid">
            <ul class="site-footer__middle-list list-unstyled row">
              <li class="col-md-4">
                <div class="icon">
                  <span class="icon-location"></span>
                </div>
                <div class="content">
                  <p>Visit our office</p>
                  <p>
                    #202-B, Imperial Heights, 150 Ft. Ring Road, <br />
                    Rajkot - 360005 (Gujarat), India
                  </p>
                </div>
              </li>
              <li class="col-md-4">
                <div class="icon">
                  <span class="icon-mail"></span>
                </div>
                <div class="content">
                  <p>Send us an Email</p>
                  <p>
                    ${site.email},<br />
                    ${site.email2}
                  </p>
                </div>
              </li>
              <li class="col-md-4">
                <div class="icon">
                  <span class="icon-call-two"></span>
                </div>
                <div class="content">
                  <p>Ask any questions</p>
                  <p>
                    ${site.phoneDisplay}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="site-footer__bottom">
          <div class="container">
            <div class="row">
              <div class="col-xl-12">
                <div class="site-footer__bottom-inner">
                  <div class="site-footer__copyright">
                    <p class="site-footer__copyright-text">
                      Copyright &copy; 2026 <a href="index.html">${esc(site.name)}</a> - All Rights Reserved.
                    </p>
                  </div>
                  <div class="site-footer__bottom-menu-box">
                    <ul class="list-unstyled site-footer__bottom-menu">
                      <li>
                        Made By : <a href="${site.creditsLink}" target="_blank">${esc(site.credits)}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="whatapp-button">
          <a href="${site.whatsapp}" target="_blank">
            <img src="chioary/assets/images/whatsapp.png" title="WhatsApp" alt="WhatsApp" style="width: 50px;" alt="">
          </a>
        </div>
      </footer>
      <!--Site Footer End-->
    </div>
    <!-- /.page-wrapper -->

    <div class="mobile-nav__wrapper">
      <div class="mobile-nav__overlay mobile-nav__toggler"></div>
      <!-- /.mobile-nav__overlay -->
      <div class="mobile-nav__content">
        <span class="mobile-nav__close mobile-nav__toggler"><i class="fa fa-times"></i></span>
        <div class="logo-box">
          <a href="index.html" aria-label="logo image"><img src="images/mark-logo.png" style="width:200px;" alt="Mark Overseas" /></a>
        </div>
        <!-- /.logo-box -->
        <div class="mobile-nav__container"></div>
        <!-- /.mobile-nav__container -->
        <ul class="mobile-nav__contact list-unstyled">
          <li>
            <i class="fa fa-envelope"></i>
            <a href="mailto:${site.email}">${site.email}</a>
          </li>
          <li>
            <i class="fas fa-phone"></i>
            <a href="tel:${site.phone}">${site.phoneDisplay}</a>
          </li>
        </ul>
        <!-- /.mobile-nav__contact -->
        <div class="mobile-nav__top">
          <div class="mobile-nav__social">
            <a href="https://api.whatsapp.com/send?phone=${site.phone}&text=Hi%20Team" target="_blank"><i class="fab fa-whatsapp"></i></a>
            <a href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://www.linkedin.com/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <!-- /.mobile-nav__top -->
      </div>
      <!-- /.mobile-nav__content -->
    </div>

    <a href="#" data-target="html" class="scroll-to-target scroll-to-top">
      <span class="scroll-to-top__wrapper"><span class="scroll-to-top__inner"></span></span>
      <span class="scroll-to-top__text"> Go Back Top</span>
    </a>

    <script src="chioary/assets/js/jquery-3.6.0.min.js"></script>
    <script src="chioary/assets/js/bootstrap.bundle.min.js"></script>
    <script src="chioary/assets/js/jarallax.min.js"></script>
    <script src="chioary/assets/js/jquery.ajaxchimp.min.js"></script>
    <script src="chioary/assets/js/jquery.appear.min.js"></script>
    <script src="chioary/assets/js/swiper.min.js"></script>
    <script src="chioary/assets/js/jquery.magnific-popup.min.js"></script>
    <script src="chioary/assets/js/jquery.validate.min.js"></script>
    <script src="chioary/assets/js/odometer.min.js"></script>
    <script src="chioary/assets/js/wNumb.min.js"></script>
    <script src="chioary/assets/js/wow.js"></script>
    <script src="chioary/assets/js/isotope.js"></script>
    <script src="chioary/assets/js/owl.carousel.min.js"></script>
    <script src="chioary/assets/js/jquery-ui.js"></script>
    <script src="chioary/assets/js/jquery.nice-select.min.js"></script>
    <script src="chioary/assets/js/jquery.circleType.js"></script>
    <script src="chioary/assets/js/jquery.fittext.js"></script>
    <script src="chioary/assets/js/jquery.lettering.min.js"></script>
    <script src="chioary/assets/js/jquery.circle-progress.min.js"></script>
    <script src="chioary/assets/js/vegas.min.js"></script>
    <script src="chioary/assets/js/aos.js"></script>
    <script src="chioary/assets/js/gsap/gsap.js"></script>
    <script src="chioary/assets/js/gsap/ScrollTrigger.js"></script>
    <script src="chioary/assets/js/gsap/SplitText.js"></script>
    <!-- template js -->
    <script src="chioary/assets/js/script.js"></script>
    <script src="js/custom.js"></script>
    <script src="js/index.js"></script>
    <script src="js/language-selector.js"></script>

    <!-- Hidden Google Translate Widget -->
    <div id="google_translate_element" style="display:none"></div>
    <script type="text/javascript">
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          autoDisplay: false
        }, 'google_translate_element');
      }
    </script>
    <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
  </body>
</html>
`;
}

/* --------------------------- PAGE SHELL LAYOUT --------------------------- */
function page({ title, desc, keywords, active, bodyContent, extraHead, extraBody }) {
  return head({ title, desc, keywords }) +
    header(active) +
    (extraHead || '') +
    bodyContent +
    footer();
}

/* --------------------------- PAGE HEADER --------------------------- */
function pageHeaderSmall(title, crumb) {
  return `
      <!--Page Header Start-->
      <section class="page-header">
        <div class="page-header__bg-shape"
          style="background-image: url(chioary/assets/images/shapes/page-header-bg-shape.png);"></div>
        <div class="container">
          <div class="page-header__inner">
            <div class="page-header__shape-1">
              <img src="chioary/assets/images/shapes/page-header-shape-1.png" alt="">
            </div>
            <h2>${esc(title)}</h2>
            <div class="thm-breadcrumb__box">
              <ul class="thm-breadcrumb list-unstyled">
                <li><a href="index.html">Home</a></li>
                <li><span>-</span></li>
                <li>${esc(crumb || title)}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <!--Page Header End-->
`;
}

/* --------------------------- PRODUCT CARD --------------------------- */
function productCard(p, col = 3, delay = 0, showShort = false) {
  return `<div class="col-xl-${col} col-lg-${col} col-md-6 wow fadeInUp" data-wow-delay=".${delay}s">
        <div class="services-one__single p-3">
          <a href="${p.slug}.html">
            <div class="services-one__img-box">
              <div class="services-one__img">
                <img src="${p.image}" alt="${esc(p.name)}" title="${esc(p.name)}" style="height: 260px; width: 100%; object-fit: contain; background: #fff;" />
              </div>
              <div class="services-one__content">
                <div class="services-one__content-inner">
                  <h3 class="services-one__title" style="margin: 12px 0 6px;">
                    <a href="${p.slug}.html" style="color: #fff;">${esc(p.name)}</a>
                  </h3>
                  ${showShort ? `<p class="services-one__text px-3" style="font-size: 13px; line-height: 20px;">${esc(p.short.length > 90 ? p.short.slice(0, 90) + '...' : p.short)}</p>` : ''}
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>`;
}

/* --------------------------- MARKET AREA SECTION --------------------------- */
function marketAreaSection() {
  return `
      <!--Market area start -->
      <section class="newsletter-one py-5 border">
        <div class="container">
          <div class="title-box mb-20 wow fadeInLeft" data-wow-delay=".5s">
            <p class="section-title m-0" style="font-size: 2rem;">Market Area</p>
          </div>
          <p class="w-100 my-2 px-2" style="font-size: 1.5rem;">Overseas :</p>
          <ul class="row list-unstyled">
            ${markets.overseas.map((m) => `<li class="col-md-3 col-sm-4 px-2 py-2"><a class="px-4 py-0 contact-page__btn" href="market-area.html">${esc(m)}</a></li>`).join('\n            ')}
          </ul>
          <p class="w-100 my-2 px-2" style="font-size: 1.5rem;">Domestic :</p>
          <ul class="row list-unstyled">
            ${markets.domestic.map((m) => `<li class="col-md-3 col-sm-4 px-2 py-2"><a class="px-4 py-0 contact-page__btn" href="market-area.html">${esc(m)}</a></li>`).join('\n            ')}
          </ul>
        </div>
      </section>
      <!-- Market area end -->
`;
}

/* --------------------------- NEWSLETTER SECTION --------------------------- */
function newsletterSection() {
  return `
      <!--Newsletter One Start -->
      <section class="newsletter-one">
        <div class="newsletter-one__bg jarallax" data-jarallax data-speed="0.2" data-imgPosition="50% 0%"
          style="background-image: url(chioary/assets/images/backgrounds/newsletter-one-bg.jpg);"></div>
        <div class="container">
          <div class="newsletter-one__inner">
            <h3 class="newsletter-one__title">
              Need any help for Agro Commodities <br />
              Export - Import ?
            </h3>
            <form class="newsletter-one__form" onsubmit="sendQuery(event, this)">
              <div class="newsletter-one__input">
                <input type="text" name="name" id="helpName" placeholder="Your Name" required />
                <input type="number" name="contact" id="helpContact" placeholder="Your Contact" required />
              </div>
              <button type="submit" class="newsletter-one__btn">
                <i class="icon-arrow-up"></i>
              </button>
            </form>
          </div>
        </div>
      </section>
      <!--Newsletter One End -->
`;
}

/* --------------------------------- INDEX --------------------------------- */
function buildIndex() {
  const featured = data.featured.map((slug) => data.products.find((p) => p.slug === slug)).filter(Boolean);

  const sliderSlides = [
    { sub: 'Premium Quality', title: 'Oil Seeds', text: 'Sesame, Groundnut, Mustard - Sourced from the finest farms.', bg: 1 },
    { sub: 'Authentic Flavor', title: 'Spices & Herbs', text: 'Cumin, Turmeric, Chilli - The essence of Indian cuisine.', bg: 2 },
    { sub: 'Staple Foods', title: 'Grains & Pulses', text: 'Rice, Maize, Millet, Pulses - Feeding the world.', bg: 1 }
  ];

  const bodyContent = `
      <!-- Main Slider Start -->
      <section class="main-slider">
        <div class="main-slider__shape-1 float-bob-x">
          <img src="chioary/assets/images/shapes/main-slider-shape-1.png" alt="" />
        </div>
        <div class="main-slider__shape-2 float-bob-y">
          <img src="chioary/assets/images/shapes/main-slider-shape-2.png" alt="" />
        </div>
        <div class="main-slider__social-box">
          <div class="main-slider__social-border"></div>
          <div class="main-slider__social">
            <a href="https://api.whatsapp.com/send?phone=${site.phone}&text=Hi%20Team" target="_blank"><i class="fab fa-whatsapp"></i></a>
            <a href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://www.linkedin.com/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div class="main-slider__carousel owl-carousel owl-theme">
          ${sliderSlides.map((s, i) => `
          <div class="item">
            <div class="main-slider__bg"
              style="background-image: url(chioary/assets/images/backgrounds/slider-1-${s.bg}.jpg);"></div>
            <div class="main-slider__map"
              style="background-image: url(chioary/assets/images/shapes/main-slider-map.png);"></div>
            <div class="container">
              <div class="main-slider__content">
                <div class="main-slider__sub-title-box">
                  <div class="main-slider__sub-title-shape"></div>
                  <h5 class="main-slider__sub-title">${s.sub}</h5>
                </div>
                <h2 class="main-slider__title">${s.title}</h2>
                <p class="main-slider__text">${s.text}</p>
                <div class="main-slider__btn-box">
                  <a href="our-products.html" class="main-slider__btn thm-btn"><span>Our Products</span><i class="icon-arrow-up"></i></a>
                </div>
              </div>
            </div>
          </div>`).join('\n          ')}
        </div>
      </section>
      <!-- Main Slider End -->

      <!-- About Two Start -->
      <section class="about-two" style="padding: 6rem 0px">
        <div class="about-two__shape-1 float-bob-x">
          <img src="chioary/assets/images/shapes/about-two-shape-1.png" alt="" />
        </div>
        <div class="container">
          <div class="row">
            <div class="col-xl-6">
              <div class="about-two__left">
                <div class="section-title text-left sec-title-animation animation-style2">
                  <h2 class="section-title__title title-animation">Welcome to Mark Overseas</h2>
                </div>
                <p class="about-two__text">
                  Mark Overseas is a prominent Export-Import Representative company based in India. We specialize in
                  agricultural commodities and serve as a strategic bridge between international buyers and global
                  suppliers.
                </p>
                <br />
                <p class="about-two__text">
                  Our mission is to provide the "essence of the agro resources" to the international market, ensuring
                  quality, consistency, and timely service.
                </p>
                <h4 class="mt-4" style="color: var(--chioary-base); font-weight: 700;">Think Agro. Think Mark</h4>
              </div>
              <div class="about-two__btn-box mt-4">
                <a href="about-us.html" class="thm-btn mb-2"><span>Know More</span><i class="icon-arrow-up"></i></a>
                <a href="our-products.html" class="thm-btn mb-2" style="background: var(--chioary-base);"><span>Our Products</span><i class="icon-arrow-up"></i></a>
              </div>
            </div>
            <div class="col-xl-6 wow fadeInRight" data-wow-delay=".3s">
              <div class="about-two__right">
                <div class="about-two__img-box">
                  <div class="about-two__img">
                    <img src="images/about-us-banner-full.png" alt="Mark Overseas" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- About Two End -->

      <!-- Featured Products Start -->
      <section class="services-one service-page1" style="background: #0B4A33">
        <div class="section-title text-center sec-title-animation animation-style1">
          <h2 class="section-title__title title-animation">Featured Products</h2>
        </div>
        <p class="text-center" style="color: #fff; max-width: 720px; margin: 0 auto 40px; padding: 0 15px;">
          We offer a wide range of premium quality agricultural products to the global market.
        </p>
        <div class="container">
          <div class="row g-2">
            ${featured.map((p, i) => productCard(p, 4, (i % 3) * 2 + 1)).join('\n            ')}
          </div>
          <div class="text-center mt-4 pt-4">
            <a href="our-products.html" class="thm-btn"><span>View All Products</span><i class="icon-arrow-up"></i></a>
          </div>
        </div>
      </section>
      <!-- Featured Products End -->

      <!-- Industries Start -->
      <section class="event-one">
        <div class="event-one__shape-1 float-bob">
          <img src="chioary/assets/images/shapes/event-one-shape-1.png" alt="" />
        </div>
        <div class="container">
          <div class="section-title text-center sec-title-animation animation-style1">
            <h2 class="section-title__title title-animation">Industries We Serve</h2>
          </div>
          <div class="row">
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".1s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/Agro Commodities Export-Import.png" alt="Agro Commodities Export-Import" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title">Agro Commodities Export-Import</h3>
                  <p class="event-one__text">
                    Supply of key food and farming products to markets across six continents with a seamless global supply chain.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".3s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/Global Sourcing.png" alt="Global Sourcing" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title">Global Sourcing</h3>
                  <p class="event-one__text">
                    Strategic sourcing from India, Africa, Southeast Asia and Latin America for consistent premium quality.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".5s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/Supply Chain Coordination.png" alt="Supply Chain Coordination" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title">Supply Chain Coordination</h3>
                  <p class="event-one__text">
                    Vendor management, quality gatekeeping and farm-to-port traceability for complete transparency.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".7s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/End-to-End Logistics.png" alt="End-to-End Logistics" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title">End-to-End Logistics</h3>
                  <p class="event-one__text">
                    Sea & air freight, customs clearance, documentation (FOB/CIF) and real-time shipment tracking.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".9s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/Quality Assurance.png" alt="Quality Assurance" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title">Quality Assurance</h3>
                  <p class="event-one__text">
                    Pre-shipment inspection, lab testing and full adherence to importing country standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Industries End -->

      <!-- Certificates Start -->
      <section class="courses-one py-5">
        <div class="courses-one__shape-1 float-bob">
          <img src="chioary/assets/images/shapes/chilli.png" style="width: 18rem; margin-top: 85px" alt="" />
        </div>
        <div class="container py-5">
          <div class="section-title text-center sec-title-animation animation-style1">
            <h2 class="section-title__title title-animation">Our Certificates / Licence</h2>
          </div>
          <div class="row justify-content-center">
            ${data.certificates.map((c, i) => `
            <div class="col-lg-4 col-md-6 py-3">
              <div class="text-center">
                <div class="courses-one__single p-4" style="background:#fff; border-radius:15px; box-shadow: 0 0 30px rgb(0 0 0 / 6%);">
                  <div class="courses-one__img-box">
                    <div class="courses-one__img">
                      <img src="images/certificate-of-origin.svg" alt="${esc(c.name)}" style="height: 90px; object-fit: contain;" />
                    </div>
                  </div>
                  <h4 class="mt-3">${esc(c.name)}</h4>
                  <p class="text-muted">${esc(c.desc)}</p>
                </div>
              </div>
            </div>`).join('\n            ')}
          </div>
          <div class="text-center mt-4">
            <a href="certificates.html" class="thm-btn"><span>View More</span><i class="icon-arrow-up"></i></a>
          </div>
        </div>
      </section>
      <!-- Certificates End -->
` + marketAreaSection() + newsletterSection();

  return page({
    title: site.title,
    desc: site.description,
    active: 'index',
    bodyContent
  });
}

/* -------------------------------- ABOUT US -------------------------------- */
function buildAbout() {
  const bodyContent = pageHeaderSmall('About Us') + `
      <!-- About Content Start -->
      <section class="team-section p-relative section-space">
        <div class="container">
          <div class="row">
            <div class="col-xl-12">
              <div class="section-title text-center sec-title-animation animation-style1 mb-5">
                <h2 class="section-title__title title-animation">Welcome to Mark Overseas</h2>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <div class="about-two__img-box mb-5">
                <div class="about-two__img">
                  <img src="images/about-us-banner-full.png" alt="About Mark Overseas" />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <p class="about-two__text">
                Mark Overseas is a prominent Export-Import Representative company based in India. We specialize in
                agricultural commodities and serve as a strategic bridge between international buyers and global suppliers.
              </p>
              <p class="about-two__text">
                Our mission is to provide the "essence of the agro resources" to the international market, ensuring
                quality, consistency, and timely service.
              </p>
              <h4 class="mt-4" style="color: var(--chioary-base); font-weight: 700;">Think Agro. Think Mark</h4>
              <div class="about-two__btn-box mt-4">
                <a href="contact-us.html" class="thm-btn"><span>Connect With Us</span><i class="icon-arrow-up"></i></a>
              </div>
            </div>
          </div>

          <div class="row mt-5">
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".1s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/mark-hero-bg.png" alt="Expert Logistics" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title" style="margin-top:4px;">EXPERT LOGISTICS</h3>
                  <p class="event-one__text">
                    Mark Overseas is a reputed export house from India, handling the export of various agricultural
                    products. Our commitment to quality and efficiency ensures your goods reach their destination on time.
                  </p>
                  <p class="event-one__text">
                    With years of experience in the international market, we provide seamless logistics solutions for agro
                    commodities across the globe.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".3s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/about-gpt-1.png" alt="Diverse Sourcing" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title" style="margin-top:4px;">DIVERSE SOURCING</h3>
                  <p class="event-one__text">
                    We source products from numerous countries including India, Vietnam, Thailand, and various nations
                    across Africa and South America. This diversity allows us to maintain a stable supply of the best produce.
                  </p>
                  <p class="event-one__text">
                    Our operational expertise covers a wide range of commodities, from oil seeds to premium spices,
                    ensuring the "essence of the agro resources" reaches our clients.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".5s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/about-gpt-2.png" alt="Long-Term Vision" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title" style="margin-top:4px;">LONG-TERM VISION</h3>
                  <p class="event-one__text">
                    We believe in building long-term relationships with our clients by providing them with premium quality
                    products at competitive prices. Our strategic positioning helps us serve all major international hubs.
                  </p>
                  <p class="event-one__text">
                    Our mission is to provide the "essence of the agro resources" to the international market, ensuring
                    quality, consistency, and timely service.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".7s">
              <div class="event-one__single">
                <div class="event-one__img-box">
                  <div class="event-one__img">
                    <img src="images/about-gpt-3.png" alt="Commitment to Excellence" style="background:#fff;object-fit:contain;padding:10px;" />
                  </div>
                </div>
                <div class="event-one__content">
                  <h3 class="event-one__title" style="margin-top:4px;">COMMITMENT TO EXCELLENCE</h3>
                  <p class="event-one__text">
                    Our dedicated team focuses on quality parameters to source the best agricultural produce from choicest
                    farms. We enjoy access to the best cultivating regions and maintain strict quality control.
                  </p>
                  <p class="event-one__text">
                    At Mark Overseas, our commitment to professional excellence makes us the preferred choice for partners
                    seeking the "essence of the agro resources."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- About Content End -->
` + marketAreaSection() + newsletterSection();

  return page({
    title: 'About Us | Mark Overseas',
    desc: 'Mark Overseas is a prominent Export-Import Representative company specializing in agricultural commodities.',
    active: 'about-us',
    bodyContent
  });
}

/* ----------------------------- OUR PRODUCTS ----------------------------- */
function buildProducts() {
  const sections = data.categories.map((cat, ci) => {
    const cards = cat.items.map((p, i) => productCard(p, 3, (i % 4) * 1 + 1, true)).join('\n              ');
    return `
          <div id="${cat.id}" class="py-4">
            <div class="text-center mb-4">
              <h2 class="section-title__title title-animation" style="color: #fff; font-size: 32px;">${esc(cat.label)}</h2>
            </div>
            <div class="row g-2">
              ${cards}
            </div>
          </div>`;
  }).join('\n');

  const bodyContent = pageHeaderSmall('Our Products') + `
      <section class="services-one service-page1" style="background: #0B4A33; padding: 100px 0;">
        <div class="section-title text-center sec-title-animation animation-style1">
          <h2 class="section-title__title title-animation" style="color:#fff;">Agro Commodities We Export</h2>
        </div>
        <p class="text-center" style="color:#fff; max-width:720px; margin:0 auto 40px; padding:0 15px;">
          Explore our wide range of premium quality agricultural commodities sourced from the finest farms, supplied to
          markets across six continents.
        </p>
        <div class="container">
          ${sections}
        </div>
      </section>
` + marketAreaSection() + newsletterSection();

  return page({
    title: 'Our Products | Mark Overseas - Agro Commodities Supplier',
    desc: 'Explore the wide range of agro commodities exported by Mark Overseas - Oil Seeds, Spices & Herbs, Grains & Pulses, Edible Nuts and Animal Feed.',
    active: 'our-products',
    bodyContent
  });
}

/* -------------------------------- EXPORTS -------------------------------- */
function buildExports() {
  const bodyContent = pageHeaderSmall('Exports') + `
      <section class="team-section p-relative section-space">
        <div class="container">
          <div class="section-title text-center sec-title-animation animation-style1">
            <h2 class="section-title__title title-animation">Connecting the World</h2>
            <p class="text-muted">Bridging international buyers with global suppliers through integrity, quality, and seamless logistics.</p>
          </div>

          <div class="row mt-5">
            <div class="col-lg-4 col-md-6 py-3">
              <div class="p-4 h-100" style="background:#fff;border-radius:15px;box-shadow:0 0 30px rgb(0 0 0 / 6%);">
                <h4 class="mb-3" style="color: var(--chioary-base);">Global Footprint</h4>
                <div>
                  ${markets.overseas.map((m) => `<span class="badge rounded-pill px-3 py-2 m-1" style="background: #0B4A33; color:#fff;">${esc(m)}</span>`).join('\n                  ')}
                </div>
                <p class="text-muted mt-3 small">Strategic partnerships in prime cultivation regions worldwide.</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 py-3">
              <div class="p-4 h-100" style="background:#fff;border-radius:15px;box-shadow:0 0 30px rgb(0 0 0 / 6%);">
                <h4 class="mb-3" style="color: var(--chioary-base);">Expert Logistics</h4>
                <ul class="list-unstyled">
                  <li class="py-1"><i class="fa-solid fa-circle-check me-2" style="color: var(--chioary-base);"></i>Seamless Sea & Air Freight</li>
                  <li class="py-1"><i class="fa-solid fa-circle-check me-2" style="color: var(--chioary-base);"></i>Custom Packaging Solutions</li>
                  <li class="py-1"><i class="fa-solid fa-circle-check me-2" style="color: var(--chioary-base);"></i>Timely Documentation (FOB/CIF)</li>
                  <li class="py-1"><i class="fa-solid fa-circle-check me-2" style="color: var(--chioary-base);"></i>End-to-End Tracking</li>
                </ul>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 py-3">
              <div class="p-4 h-100" style="background:#fff;border-radius:15px;box-shadow:0 0 30px rgb(0 0 0 / 6%);">
                <h4 class="mb-3" style="color: var(--chioary-base);">Commodity Portfolio</h4>
                <ul class="list-unstyled mb-0">
                  <li class="py-1"><strong>Oil Seeds</strong> - Sesame, Groundnut, Mustard</li>
                  <li class="py-1"><strong>Spices</strong> - Cumin, Chilli, Turmeric, Coriander</li>
                  <li class="py-1"><strong>Grains</strong> - Rice, Maize, Millet</li>
                  <li class="py-1"><strong>Pulses</strong> - Chickpeas, Lentils, Beans</li>
                  <li class="py-1"><strong>Animal Feed</strong> - Soya Cake, Rapeseed Meal</li>
                  <li class="py-1"><strong>Specialty</strong> - Dehydrated Vegetables, Herbs</li>
                </ul>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 py-3">
              <div class="p-4 h-100" style="background:#fff;border-radius:15px;box-shadow:0 0 30px rgb(0 0 0 / 6%);">
                <h4 class="mb-3" style="color: var(--chioary-base);">Industries Served</h4>
                <div>
                  ${['Edible Oil', 'Spices & Seasoning', 'Food Processing', 'Animal Feed', 'Bakery & Confectionery'].map((m) => `<span class="badge rounded-pill px-3 py-2 m-1" style="background: #0B4A33; color:#fff;">${esc(m)}</span>`).join('\n                  ')}
                </div>
                <p class="text-muted mt-3 small">Supplying premium raw materials to diverse sectors.</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 py-3">
              <div class="p-4 h-100 text-center" style="background:#0B4A33;border-radius:15px;box-shadow:0 0 30px rgb(0 0 0 / 12%);">
                <h4 class="mb-3" style="color:#fff;">Our Mission</h4>
                <p class="text-white" style="font-style:italic;">"To provide the Essence of Agro Resources to the international market."</p>
                <div class="d-flex justify-content-center gap-3 mt-3">
                  <span class="badge rounded-pill px-3 py-2" style="background:#c29a5b; color:#0B4A33;">Global Sourcing</span>
                  <span class="badge rounded-pill px-3 py-2" style="background:#c29a5b; color:#0B4A33;">Premium Quality</span>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 py-3">
              <div class="p-4 h-100" style="background:#fff;border-radius:15px;box-shadow:0 0 30px rgb(0 0 0 / 6%);">
                <h4 class="mb-3" style="color: var(--chioary-base);">Core Values</h4>
                <ul class="list-unstyled mb-0">
                  <li class="py-1"><strong>Long-Term Vision:</strong> Building lasting relationships.</li>
                  <li class="py-1"><strong>Commitment:</strong> Focusing on quality parameters.</li>
                  <li class="py-1"><strong>Professionalism:</strong> Excellence in every deal.</li>
                  <li class="py-1"><strong>Efficiency:</strong> Timely delivery worldwide.</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="text-center mt-5">
            <a href="contact-us.html" class="thm-btn mb-2"><span>Let's build business together</span><i class="icon-arrow-up"></i></a>
            <a href="our-products.html" class="thm-btn mb-2" style="background: var(--chioary-base);"><span>View Product</span><i class="icon-arrow-up"></i></a>
          </div>
        </div>
      </section>
` + marketAreaSection() + newsletterSection();

  return page({
    title: 'Exports | Mark Overseas',
    desc: 'Global reach of Mark Overseas - exporting oil seeds, spices, grains, pulses and animal feed to markets across six continents.',
    active: 'exports',
    bodyContent
  });
}

/* ------------------------- INDUSTRIES WE SERVE ------------------------- */
function buildIndustries() {
  const services = [
    {
      title: 'Agro Commodities Export-Import',
      intro: 'We operate at the forefront of the agricultural export and import industry, supplying key food and farming products to markets across six continents. Our extensive network connects farmers, processors, and end-users in a seamless global supply chain.',
      sub: 'Our Export Capabilities',
      bullets: [
        'Volume Flexibility: From 20-foot containers to bulk vessel shipments',
        'Quality Assurance: Pre-shipment inspection and lab testing for all consignments',
        'Custom Specifications: Tailored grading, sorting, and packaging per buyer requirements',
        'Regulatory Compliance: Full adherence to importing country standards (FDA, EU, FSSAI)',
        'Competitive Pricing: Direct sourcing from origin ensures best market rates'
      ]
    },
    {
      title: 'Procurement & Supply Chain Coordination',
      intro: 'Acting as a strategic bridge between suppliers and global buyers, we coordinate complex multi-country procurement operations. Our presence in major producing regions ensures consistent supply and quality control throughout the value chain.',
      sub: 'Supply Chain Services',
      bullets: [
        'Vendor Management: Curated network of 200+ verified suppliers across 15 countries',
        'Quality Gatekeeping: On-ground inspection teams at origin points',
        'Inventory Planning: Demand forecasting and buffer stock management',
        'Risk Mitigation: Multi-source strategy to avoid supply disruptions',
        'Traceability: Farm-to-port tracking for complete transparency',
        'Consolidation: Combining smaller lots for cost-effective shipping'
      ]
    },
    {
      title: 'End-to-End Export Services',
      intro: 'We manage every aspect of the export process, from initial sourcing to final delivery at the buyer\u2019s warehouse. Our integrated approach eliminates coordination hassles and ensures smooth, on-time shipments.',
      sub: 'Complete Export Management',
      bullets: [
        'Product Sourcing & Selection: Identifying optimal suppliers, negotiating terms, and securing the best quality at competitive prices',
        'Quality Control & Testing: Pre-shipment sampling, laboratory analysis, moisture testing, and certification',
        'Logistics Coordination: Container booking, freight forwarding, customs clearance, and port handling',
        'Documentation & Compliance: Bill of Lading, Certificate of Origin, Phytosanitary certificates, and all regulatory paperwork',
        'Shipment Tracking: Real-time vessel tracking, ETA updates, and proactive communication'
      ]
    },
    {
      title: 'Market & Commodity Information',
      intro: 'Stay ahead of market trends with our comprehensive information tools and resources. We provide buyers and sellers with critical data to make informed trading decisions and optimize their procurement strategies.',
      sub: 'Market Intelligence',
      bullets: [
        'Price Trends: Weekly commodity price reports and analysis',
        'Demand Forecasts: Market demand projections based on global consumption patterns',
        'Crop Reports: Production estimates and harvest quality assessments',
        'Trade Policy Updates: Changes in tariffs, quotas, and import regulations',
        'Competitor Analysis: Market positioning and pricing benchmarks'
      ]
    },
    {
      title: 'Global Trade Facilitation',
      intro: 'Building lasting partnerships through transparency, reliability, and consistent quality. We facilitate seamless international trade by connecting buyers and sellers with trust, clear communication, and market expertise.',
      sub: 'Partnership Benefits',
      bullets: [
        'Flexible Payment Terms: LC, TT, and customized credit arrangements for established partners',
        'Market Access: Connect with verified buyers and suppliers in 50+ countries',
        'Technical Support: Guidance on product specifications, quality standards, and compliance',
        'Dispute Resolution: Fair and transparent handling of quality claims and commercial issues',
        'Long-Term Contracts: Annual supply agreements with price stability mechanisms',
        'Trade Finance: Assistance with letters of credit, bank guarantees, and export financing'
      ]
    }
  ];

  const cards = services.map((svc, i) => `
            <div class="col-xl-6 col-lg-6 wow fadeInUp" data-wow-delay=".${(i % 2) * 2 + 1}s">
              <div class="services-one__single p-3">
                <div class="p-4 h-100" style="background:#fff;border-radius:15px;box-shadow:0 0 30px rgb(0 0 0 / 6%);">
                  <h3 class="event-one__title" style="margin-top:6px;">${esc(svc.title)}</h3>
                  <p class="event-one__text">${esc(svc.intro)}</p>
                  <ul class="list-unstyled">
                    ${svc.bullets.map((b) => `<li class="py-1 small"><i class="fa-solid fa-circle-check me-2" style="color: var(--chioary-base);"></i>${esc(b)}</li>`).join('\n                    ')}
                  </ul>
                </div>
              </div>
            </div>`).join('\n');

  const bodyContent = pageHeaderSmall('Industries We Serve') + `
      <section class="services-one service-page1" style="background: #0B4A33; padding: 100px 0;">
        <div class="section-title text-center sec-title-animation animation-style1">
          <h2 class="section-title__title title-animation" style="color:#fff;">Fueling Industries Across the Globe</h2>
        </div>
        <p class="text-center" style="color:#fff; max-width:720px; margin:0 auto 40px; padding:0 15px;">
          Our premium commodities fuel various industries around the globe.
        </p>
        <div class="container">
          <div class="row g-3">
            ${cards}
          </div>
          <div class="text-center mt-5">
            <h4 style="color:#fff;">Let's build business together</h4>
            <p style="color:#fff;">Join our network of global partners and experience seamless agricultural commodity trade.</p>
            <a href="contact-us.html" class="thm-btn"><span>Contact Our Team</span><i class="icon-arrow-up"></i></a>
          </div>
        </div>
      </section>
` + marketAreaSection() + newsletterSection();

  return page({
    title: 'Industries We Serve | Mark Overseas',
    desc: 'Mark Overseas supplies to Edible Oil, Spices, Food Processing, and Animal Feed industries worldwide.',
    active: 'industries-we-serve',
    bodyContent
  });
}

/* ------------------------------ CERTIFICATES ------------------------------ */
function buildCertificates() {
  const bodyContent = pageHeaderSmall('Certificates') + `
      <section class="team-section p-relative section-space">
        <div class="container">
          <div class="section-title text-center sec-title-animation animation-style1">
            <h2 class="section-title__title title-animation">Ensuring Quality and Trust through Global Standards</h2>
            <p class="text-muted">
              At Mark Overseas, we are committed to maintaining the highest standards of quality and hygiene. We conform
              to various international quality standards and hold certifications that testify to our commitment to excellence.
            </p>
          </div>
          <div class="row justify-content-center mt-5">
            ${data.certificates.map((c, i) => `
            <div class="col-lg-4 col-md-6 py-3 wow fadeInUp" data-wow-delay=".${(i * 2) + 1}s">
              <div class="p-4 text-center h-100" style="background:#fff;border-radius:15px;box-shadow:0 0 30px rgb(0 0 0 / 6%);">
                <div class="courses-one__img-box">
                  <div class="courses-one__img">
                    <img src="images/certificate-of-origin.svg" alt="${esc(c.name)}" style="height: 120px; object-fit: contain;" />
                  </div>
                </div>
                <h4 class="mt-4" style="color: var(--chioary-base);">${esc(c.name)}</h4>
                <p class="text-muted">${esc(c.desc)}</p>
              </div>
            </div>`).join('\n            ')}
          </div>
        </div>
      </section>
` + marketAreaSection() + newsletterSection();

  return page({
    title: 'Certificates | Mark Overseas',
    desc: 'Review the quality certifications and standards maintained by Mark Overseas for export and import of agricultural commodities.',
    active: 'certificates',
    bodyContent
  });
}

/* ------------------------------ CONTACT US ------------------------------ */
function buildContact() {
  const bodyContent = pageHeaderSmall('Contact Us') + `
      <section class="contact-page">
        <div class="container">
          <div class="section-title text-center sec-title-animation animation-style1 mb-5">
            <h2 class="section-title__title title-animation">Get In Touch With Us</h2>
            <p class="text-muted">Fill up the form and our Team will get back to you within 24 hours</p>
          </div>

          <!-- contact info -->
          <div class="row justify-content-center mb-5">
            <div class="col-xl-4 col-lg-6 col-md-6 py-2">
              <div class="contact-two__single">
                <div class="contact-two__icon">
                  <span class="icon-call"></span>
                </div>
                <div class="contact-two__content">
                  <h4>Contact Phone</h4>
                  <p><a href="tel:${site.phone}">${site.phoneDisplay}</a></p>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-lg-6 col-md-6 py-2">
              <div class="contact-two__single">
                <div class="contact-two__icon">
                  <span class="icon-mail"></span>
                </div>
                <div class="contact-two__content">
                  <h4>Send Email</h4>
                  <p><a href="mailto:${site.email}">${site.email}</a></p>
                  <p><a href="mailto:${site.email2}">${site.email2}</a></p>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-lg-6 col-md-6 py-2">
              <div class="contact-two__single m-0">
                <div class="contact-two__icon">
                  <span class="icon-location"></span>
                </div>
                <div class="contact-two__content">
                  <h4>Our Office</h4>
                  <p>#202-B, Imperial Heights, 150 Ft. Ring Road,<br /> Rajkot - 360005 (Gujarat), India</p>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-page__inner">
            <h3 class="contact-page__title">Send Message</h3>
            <form class="contact-form-validated contact-page__form" onsubmit="sendQuery(event, this)">
              <div class="row">
                <div class="col-xl-6 col-lg-6">
                  <div class="contact-page__input-box">
                    <h4 class="contact-page__input-title">Your Name</h4>
                    <input type="text" name="name" id="name" placeholder="Enter Your Name" required />
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6">
                  <div class="contact-page__input-box">
                    <h4 class="contact-page__input-title">Your Mail</h4>
                    <input type="email" name="email" id="email" placeholder="Enter Your Email Address" required />
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6">
                  <div class="contact-page__input-box">
                    <h4 class="contact-page__input-title">Contact No</h4>
                    <input type="number" name="contact" id="contact" placeholder="Enter Contact Number" required />
                  </div>
                </div>
                <div class="col-xl-6 col-lg-6">
                  <div class="contact-page__input-box">
                    <h4 class="contact-page__input-title">Subject</h4>
                    <input type="text" name="subject" id="subject" placeholder="Enter Subject" required />
                  </div>
                </div>
                <div class="col-xl-12">
                  <div class="contact-page__input-box text-message-box">
                    <h4 class="contact-page__input-title">Message</h4>
                    <textarea name="message" id="message" placeholder="Write your message"></textarea>
                  </div>
                  <div class="contact-page__btn-box">
                    <button type="submit" class="contact-page__btn"><span>Send Message</span></button>
                  </div>
                </div>
              </div>
            </form>
            <div class="result"></div>
          </div>
        </div>
      </section>
      <!--Contact Page End-->

      <!--Google Map Start -->
      <section class="google-map mt-5">
        <div class="container">
          <div class="google-map__one">
            <iframe src="${site.mapEmbed}" class="google-map__one-iframe" width="100%" height="400" style="border:0;" allowfullscreen loading="lazy"></iframe>
          </div>
        </div>
      </section>
      <!--Google Map End-->
` + marketAreaSection() + newsletterSection();

  return page({
    title: 'Contact Us | Mark Overseas',
    desc: 'Contact Mark Overseas for inquiries about Oil Seeds, Spices, and other agro commodities.',
    active: 'contact-us',
    bodyContent
  });
}

/* ------------------------------ MARKET AREA ------------------------------ */
function buildMarketArea() {
  const bodyContent = pageHeaderSmall('Market Area') + `
      <section class="newsletter-one py-5 border">
        <div class="container">
          <div class="title-box mb-20 wow fadeInLeft" data-wow-delay=".5s">
            <p class="section-title m-0" style="font-size: 2rem;">Market Area</p>
          </div>
          <p class="w-100 my-2 px-2" style="font-size: 1.5rem;">Overseas :</p>
          <ul class="row list-unstyled">
            ${markets.overseas.map((m) => `<li class="col-md-3 col-sm-4 px-2 py-2"><a class="px-4 py-0 contact-page__btn" href="market-area.html">${esc(m)}</a></li>`).join('\n            ')}
          </ul>
          <p class="w-100 my-2 px-2" style="font-size: 1.5rem;">Domestic :</p>
          <ul class="row list-unstyled">
            ${markets.domestic.map((m) => `<li class="col-md-3 col-sm-4 px-2 py-2"><a class="px-4 py-0 contact-page__btn" href="market-area.html">${esc(m)}</a></li>`).join('\n            ')}
          </ul>
        </div>
      </section>
` + newsletterSection();

  return page({
    title: 'Market Area | Mark Overseas',
    desc: 'Mark Overseas exports agro commodities to markets across the globe - India, Vietnam, Thailand, Africa, South America, Middle East, Europe, USA and Southeast Asia.',
    active: 'market-area',
    bodyContent
  });
}

/* ----------------------------- PRODUCT VARIANTS ----------------------------- */
const WA_PHONE = '919978925996';
const WA_LINK = (msg) => `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(msg)}`;

const PRODUCT_VARIANTS = {
  'product-chilli': [
    {
      image: 'images/products/subtypes/chilli-s17.png',
      badge: 'High Pungency',
      title: 'S17 / Guntur Sannam Chilli',
      desc: 'S17 is the most popular variety of Indian red chilli, known for its high pungency and deep red color. It is widely used in spice blends and direct culinary applications globally.',
      specs: [['HS Code', '09042110 / 09042211'], ['Variety', 'S17 (Teja), Byadgi, Guntur Sannam, 334'], ['SHU (Pungency)', '8,000 - 100,000 SHU'], ['Color (ASTA)', '60 - 160 ASTA'], ['Moisture', '10-12% Max']],
      slug: 'product-chilli-s17',
      link: 'product-chilli-s17.html'
    },
    {
      image: 'images/products/subtypes/chilli-teja.png',
      badge: 'Extreme Heat',
      title: 'Teja Chilli (S12)',
      desc: 'Teja is the hottest variety of commercial chilli in India. It is highly sought after for oleoresin extraction and by food manufacturers who require intense heat.',
      specs: [['SHU (Heat)', '70,000 - 90,000'], ['ASTA (Color)', '50 - 70'], ['Moisture', '12% Max']],
      slug: 'product-chilli-teja',
      link: 'product-chilli-teja.html'
    },
    {
      image: 'images/products/subtypes/chilli-byadgi.png',
      badge: 'Rich Color',
      title: 'Byadgi Chilli',
      desc: 'Byadgi is famous for its deep red color and wrinkled appearance. It has very low heat and mild pungency, making it perfect for color-focused spice applications.',
      specs: [['SHU (Heat)', '8,000 - 15,000'], ['ASTA (Color)', '140 - 180 (High)'], ['Moisture', '12% Max']],
      slug: 'product-chilli-byadgi',
      link: 'product-chilli-byadgi.html'
    }
  ],
  'product-sesame': [
    {
      image: 'images/products/subtypes/sesame-natural.png',
      badge: 'Natural Variety',
      title: 'Natural Sesame Seeds',
      desc: 'Natural Sesame Seeds from the plant Sesamum Indicum L. Suited for human consumption. The whitish seeds are highly valued for their nutty flavor and nutritional profile. Our seeds are sourced from the best growing regions in India.',
      specs: [['HS Code', '12074090'], ['Type', 'Natural, Hulled (99.98% Purity), Black'], ['Oil Content', '48% - 52% Min'], ['Moisture', '5-6% Max'], ['FFA', '1% - 2% Max']],
      link: 'product-sesame-natural.html'
    },
    {
      image: 'images/products/subtypes/sesame-hulled.png',
      badge: 'Hulled Variety',
      title: 'Hulled Sesame Seeds',
      desc: 'Through a mechanical hulling process, the outer skin is removed, leaving a pearly white seed with a rich, nutty flavor. They are perfect for baking and confectionery applications.',
      specs: [['Purity', '99.9% / 99.95% / 99.99%'], ['Moisture', '5.0% Max'], ['Oil Content', '48% Min'], ['Applications', 'Baking, Tahini, Confectionery']],
      link: 'product-sesame-hulled.html'
    },
    {
      image: 'images/products/subtypes/sesame-black.png',
      badge: 'Black Variety',
      title: 'Black Sesame Seeds',
      desc: 'Distinctively jet black and rich in oil, black sesame seeds are prizewinning for their strong aroma and nutritional benefits. Widely used in Asian cuisine and decoration.',
      specs: [['Purity', '99% / 99.9% / 99.95%'], ['Color', 'Jet Black'], ['Oil Content', '45% Min'], ['Moisture', '5% Max']],
      link: 'product-sesame-black.html'
    },
    {
      image: 'images/products/subtypes/sesame-brown.png',
      badge: 'Brown Variety',
      title: 'Brown Sesame Seeds',
      desc: 'Brown Sesame Seeds offer a robust flavor and are commonly used in Middle Eastern and Mediterranean cuisines. High oil content and nutritional integrity.',
      specs: [['Purity', '99% / 99.5% / 99.9%'], ['Moisture', '6.0% Max'], ['Oil Content', '45% Min'], ['FFA', '2.0% Max']],
      link: 'product-sesame-brown.html'
    }
  ],
  'product-groundnut': [
    {
      image: 'images/products/subtypes/groundnut-bold.png',
      badge: 'Bold Variety',
      title: 'Bold Groundnuts (Peanuts)',
      desc: 'Bold groundnuts have a reddish-brown skin and a characteristic elongated shape. They are highly preferred for direct consumption and as a key ingredient in snack foods.',
      specs: [['HS Code', '12024210 (Kernels)'], ['Variety', 'Bold / Java (HPS Shelling)'], ['Counts per Oz', 'Bold: 35/40 - 70/80 | Java: 50/60 - 140/160'], ['Moisture', '6-8% Max'], ['Oil Content', '42% - 52% Min']],
      link: 'product-groundnut-bold.html'
    },
    {
      image: 'images/products/subtypes/groundnut-java.png',
      badge: 'Java Variety',
      title: 'Java Peanuts (Groundnuts)',
      desc: 'Java groundnuts are smaller and more spherical than the Bold variety, with a pinkish skin. They are widely used for oil extraction and by the food industry for various formulations.',
      specs: [['Counts per Ounce', '50/60, 60/70, 70/80'], ['Moisture', '7% Max'], ['Admixture', '1% Max']],
      link: 'product-groundnut-java.html'
    },
    {
      image: 'images/products/subtypes/groundnut-blanched.png',
      badge: 'Processed',
      title: 'Blanched Peanuts (Whole & Splits)',
      desc: 'Blanched peanuts are processed to remove the outer skin, resulting in white kernels. They are ready for roasting, salting, or use in confectionery and peanut butter.',
      specs: [['Type', 'Whole / Splits'], ['Color', 'White / Off-White'], ['Purity', '99.9% Min (Sortex)']],
      link: 'product-peanut-blanched.html'
    }
  ],
  'product-mustard': [
    {
      image: 'images/products/subtypes/mustard-yellow.png',
      badge: 'Yellow Variety',
      title: 'Yellow Mustard Seeds',
      desc: 'Yellow mustard seeds have a milder flavor compared to brown mustard. They are widely used in pickles, spice blends, and the production of yellow mustard condiments. Our seeds are sourced from the best growing regions in North India.',
      specs: [['HS Code', '12075000'], ['Variety', 'Yellow Mustard, Brown Mustard, Black'], ['Oil Content', '38% - 42% Min'], ['Purity', '99% - 99.9% Max'], ['Moisture', '8-9% Max']],
      link: 'product-mustard-yellow.html'
    },
    {
      image: 'images/products/subtypes/mustard-brown.png',
      badge: 'Brown Variety',
      title: 'Brown Mustard Seeds (Rai)',
      desc: 'Brown mustard seeds are more pungent and spicy than yellow ones. They are a staple in Indian tempering (tadka) and are also heavily used in the production of spicy brown mustards and dijon-style mustards globally.',
      specs: [['Oil Content', '35% - 42% Min'], ['Moisture', '8% Max'], ['Purity', '99% Min']],
      link: 'product-mustard-brown.html'
    }
  ]
};

function variantsToHtml(p) {
  const variants = PRODUCT_VARIANTS[p.slug];
  if (!variants || !variants.length) return '';
  return `
              <section class="product-variants-section mt-5">
                <div class="text-center mb-4">
                  <h2 class="variants-heading">Available <span>Varieties</span></h2>
                </div>
                <div class="row g-4">
                  ${variants.map((v) => `
                  <div class="col-lg-12">
                    <div class="variant-item">
                      <div class="variant-image">
                        <a href="${v.link}" title="${esc(v.title)}">
                          <img src="${v.image}" alt="${esc(v.title)}" loading="lazy" />
                        </a>
                      </div>
                      <div class="variant-details">
                        <span class="variant-badge">${esc(v.badge)}</span>
                        <h3><a href="${v.link}" title="${esc(v.title)}">${esc(v.title)}</a></h3>
                        <p class="variant-description">${esc(v.desc)}</p>
                        <div class="table-responsive variant-specs">
                          <table class="table mb-0">
                            <tbody>
                            ${v.specs.map(([label, val]) => `
                            <tr>
                              <th scope="row">${esc(label)}</th>
                              <td>${esc(val)}</td>
                            </tr>`).join('')}
                            </tbody>
                          </table>
                        </div>
                        <div class="variant-actions mt-3">
                          <a href="${v.link}" class="variant-enquiry-btn">View More</a>
                          <a href="https://api.whatsapp.com/send?phone=%2B919978925996&text=${encodeURIComponent('Hi, I am interested in ' + v.title + '.')}" target="_blank" rel="noopener" class="variant-wa-btn"><i class="fab fa-whatsapp"></i> Enquire Now</a>
                        </div>
                      </div>
                    </div>
                  </div>`).join('')}
                </div>
              </section>`;
}

/* ------------------------------ PRODUCT PAGES ------------------------------ */
const specsToHtml = (specs) => {
  if (!specs || !specs.length) return '';
  return `
                <div class="table-responsive mt-4">
                  <table class="table table-bordered mb-0">
                    <tbody>
                      ${specs.map((s) => `
                      <tr>
                        <th style="width: 35%; background:#0B4A33; color:#fff;">${esc(s.label)}</th>
                        <td>${esc(s.value)}</td>
                      </tr>`).join('\n                      ')}
                    </tbody>
                  </table>
                </div>`;
};

const descToHtml = (p) => {
  const paras = (p.description && p.description.length ? p.description : [p.short]).filter(Boolean);
  return paras.map((txt) => `<p class="about-two__text">${esc(txt)}</p>`).join('\n              ');
};

function productPageBody(p) {
  const h1 = esc(p.rawTitle.includes('Exporter') ? p.rawTitle : `${p.rawTitle} Exporter in India`);
  return `
      <!--Page Header Start-->
      <section class="page-header">
        <div class="page-header__bg-shape"
          style="background-image: url(chioary/assets/images/shapes/page-header-bg-shape.png);"></div>
        <div class="container">
          <div class="page-header__inner">
            <div class="page-header__shape-1">
              <img src="chioary/assets/images/shapes/page-header-shape-1.png" alt="">
            </div>
            <p class="page-header-title">${esc(p.rawTitle)}</p>
            <div class="thm-breadcrumb__box">
              <ul class="thm-breadcrumb list-unstyled">
                <li><h1>${h1}</h1></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <!--Page Header End-->

      <!-- Design -->
      <section class="team-section p-relative section-space">
        <div class="container">
          <div class="row">
            <div class="col-lg-5">
              <div class="about-two__img mb-4">
                <div class="about-two__img-box" style="border-radius: 15px; overflow: hidden; background: #fff; padding: 15px;">
                  <img src="${p.image}" style="width: 100%; border-radius: 8px;" title="${esc(p.rawTitle)}" alt="${esc(p.rawTitle)}" />
                </div>
              </div>
              <div class="p-4" style="background:#0B4A33; border-radius: 15px; color:#fff;">
                <h4 style="color:#fff;">Enquire About This Product</h4>
                <p class="small mt-2 mb-3">Fill up the form and our Team will get back to you within 24 hours</p>
                <form onsubmit="sendQuery(event, this, '${esc(p.rawTitle)}')">
                  <div class="form-group mb-2">
                    <input type="text" class="form-control" name="name" placeholder="Your Name" required />
                  </div>
                  <div class="form-group mb-2">
                    <input type="number" class="form-control" name="contact" placeholder="Your Contact No." required />
                  </div>
                  <div class="form-group mb-2">
                    <input type="email" class="form-control" name="email" placeholder="Your Email" required />
                  </div>
                  <div class="form-group mb-2">
                    <textarea class="form-control" name="message" rows="3" placeholder="Your Message"></textarea>
                  </div>
                  <button type="submit" class="contact-page__btn" style="background:#c29a5b; color:#0B4A33; border:none; width:100%;"><span>Send Query</span></button>
                </form>
              </div>
            </div>
            <div class="col-lg-7">
              <div id="item-content" class="pb-5">
                <h2 style="color: var(--chioary-base); font-weight: 700;">${esc(p.rawTitle)}</h2>
                ${specsToHtml(p.specs)}
                <div class="mt-4">
                  ${descToHtml(p)}
                </div>
              </div>
            </div>
          </div>
          ${variantsToHtml(p)}
        </div>
      </section>
      <!-- End Design -->
` + marketAreaSection() + newsletterSection();
}

function writeProductPage(p) {
  const html = page({
    title: `${p.rawTitle} Exporter in India | Mark Overseas`,
    desc: p.short,
    keywords: `${p.name}, ${(p.category || 'agro commodities')}, agro commodities exporter, spices supplier, oil seeds export, grains and pulses india, animal feed exporter gujarat, mark overseas rajkot`,
    active: 'our-products',
    bodyContent: productPageBody(p)
  });
  fs.writeFileSync(path.join(ROOT, `${p.slug}.html`), html);
}

function buildProductsPages() {
  data.products.forEach((p) => writeProductPage(p));

  (PRODUCT_VARIANTS['product-chilli'] || []).forEach((v) => {
    if (!v.slug) return;
    writeProductPage({
      slug: v.slug,
      rawTitle: v.title,
      name: v.title,
      category: 'Herbs & Spices',
      image: v.image,
      short: v.desc,
      description: [v.desc],
      specs: v.specs.map(([label, value]) => ({ label, value }))
    });
  });
}

/* --------------------------------- MAIN --------------------------------- */
function write(name, content) {
  fs.writeFileSync(path.join(ROOT, name), content);
  console.log('Wrote', name, `(${Math.round(content.length / 1024)} KB)`);
}

fs.mkdirSync(path.join(ROOT, 'js'), { recursive: true });

write('index.html', buildIndex());
write('about-us.html', buildAbout());
write('our-products.html', buildProducts());
write('exports.html', buildExports());
write('industries-we-serve.html', buildIndustries());
write('certificates.html', buildCertificates());
write('contact-us.html', buildContact());
write('market-area.html', buildMarketArea());

buildProductsPages();
console.log('Done. Products pages:', data.products.length);