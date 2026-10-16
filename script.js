// GA4 event tracking helper
function trackEvent(name, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', name, params);
  }
}

function trackContactClick(method, location) {
  trackEvent('contact_click', { method, link_location: location });
}

// Logo hover + Esc: toggle Google Analytics on/off for this browser tab's
// session. Uses gtag's documented window['ga-disable-<ID>'] flag, persisted
// via sessionStorage so it's re-applied (see the inline <head> script) on
// every page load in this tab until the tab is closed. No backend involved,
// and it can't target by IP -- that would require server-side blocking.
const GA_MEASUREMENT_ID = 'G-BNM5R1YZEC';
let logoHovered = false;
let logoFlashTimeout = null;

function initLogoOptOut() {
  const logoLink = document.querySelector('.logo-link');
  if (!logoLink) return;

  logoLink.addEventListener('mouseenter', () => { logoHovered = true; });
  logoLink.addEventListener('mouseleave', () => { logoHovered = false; });
}

function flashLogo(color) {
  const logoImg = document.getElementById('logoImg');
  if (!logoImg) return;

  const flashClass = color === 'green' ? 'logo-flash-green' : 'logo-flash-red';

  logoImg.classList.remove('logo-flash-red', 'logo-flash-green');
  if (logoFlashTimeout) clearTimeout(logoFlashTimeout);

  // Force reflow so re-triggering the same color still restarts the flash
  void logoImg.offsetWidth;
  logoImg.classList.add(flashClass);

  logoFlashTimeout = setTimeout(() => {
    logoImg.classList.remove(flashClass);
    logoFlashTimeout = null;
  }, 2000);
}

window.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && logoHovered) {
    const isDisabled = window[`ga-disable-${GA_MEASUREMENT_ID}`] === true;

    if (isDisabled) {
      window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
      sessionStorage.setItem('ga_opt_out', 'false');
      console.log('Analytics tracking re-enabled for this browser tab.');
      flashLogo('green');
    } else {
      window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
      sessionStorage.setItem('ga_opt_out', 'true');
      console.log('Analytics tracking disabled for this browser tab.');
      flashLogo('red');
    }
  }
});

// Theme Toggle Functionality
function toggleTheme() {
  const root = document.documentElement;
  const themeIcon = document.getElementById('themeIcon');
  const currentTheme = root.classList.contains('light-mode') ? 'dark' : 'light';
  trackEvent('theme_toggle', { theme: currentTheme });

  // Fade out icon
  themeIcon.style.opacity = '0';
  
  setTimeout(() => {
    if (currentTheme === 'light') {
      root.classList.add('light-mode');
      themeIcon.src = 'img/icons/dark.png';
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light-mode');
      themeIcon.src = 'img/icons/light.png';
      localStorage.setItem('theme', 'dark');
    }
    // Fade in icon
    themeIcon.style.opacity = '1';
  }, 150);
}

// The saved theme class is applied by an inline <head> script before first
// paint; this just syncs the toggle icon to match.
function loadTheme() {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon && document.documentElement.classList.contains('light-mode')) {
    themeIcon.src = 'img/icons/dark.png';
  }
}

// Web-sized copies of the originals in img/ (800px on the short side, WebP).
// Add a matching file here whenever a new photo goes in -- the camera
// originals are 1-8 MB each and far too heavy to serve directly.
const imageDir = './img/gallery';

// List of all dog images
const dogImages = [
  { src: `${imageDir}/rosco.webp`, alt: 'Rosco' },
  { src: `${imageDir}/stella.webp`, alt: 'Stella' },
  { src: `${imageDir}/reef.webp`, alt: 'Reef' },
  { src: `${imageDir}/mak.webp`, alt: 'Mak' },
  { src: `${imageDir}/makreef.webp`, alt: 'Mak and Reef' },
  { src: `${imageDir}/lady.webp`, alt: 'Lady' },
  { src: `${imageDir}/lola.webp`, alt: 'Lola' },
  { src: `${imageDir}/ziggy.webp`, alt: 'Ziggy' },
  { src: `${imageDir}/bruno.webp`, alt: 'Bruno' },
  { src: `${imageDir}/charlie.webp`, alt: 'Charlie' },
  { src: `${imageDir}/chuck.webp`, alt: 'Chuck' },
  { src: `${imageDir}/nala.webp`, alt: 'Nala' },
  { src: `${imageDir}/nalaz.webp`, alt: 'Nala' },
  { src: `${imageDir}/stella1.webp`, alt: 'Stella' },
  { src: `${imageDir}/bordercollie.webp`, alt: 'Border Collie' },
  { src: `${imageDir}/shepherdmix.webp`, alt: 'Shepherd mix' },
  { src: `${imageDir}/bernese.webp`, alt: 'Bernese Mountain Dog' },
  { src: `${imageDir}/cavalier.webp`, alt: 'Cavalier mix' },
  { src: `${imageDir}/cockapoo.webp`, alt: 'Cockapoo' }
];

// Function to generate a random collage of images
function generateCollage() {
  const collageContainer = document.querySelector('.collage-container');
  
  if (!collageContainer) return;

  // Pick 4 random images (Fisher-Yates; sort() with a random comparator is biased)
  const shuffledImages = [...dogImages];
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
  }

  // Create and append image elements
  shuffledImages.slice(0, 4).forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.src;
    imgElement.alt = image.alt;
    imgElement.width = 800;
    imgElement.height = 800;
    imgElement.decoding = 'async';
    imgElement.classList.add('collage-image');
    imgElement.loading = 'lazy';
    collageContainer.appendChild(imgElement);
  });
}

// Open/close the contact dropdown, swapping the icon with a fade
function setContactDropdown(open) {
  const dropdown = document.getElementById('contactDropdown');
  const button = document.querySelector('.contact-icon-btn');
  const icon = document.getElementById('contactIcon');
  if (!dropdown || dropdown.classList.contains('active') === open) return;

  dropdown.classList.toggle('active', open);
  button.setAttribute('aria-expanded', String(open));
  icon.style.opacity = '0';
  setTimeout(() => {
    icon.src = open ? 'img/icons/close.png' : 'img/icons/contact.svg';
    icon.style.opacity = '1';
  }, 150);
}

function toggleContactDropdown() {
  const dropdown = document.getElementById('contactDropdown');
  const open = !dropdown.classList.contains('active');
  if (open) trackEvent('contact_dropdown_open');
  setContactDropdown(open);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('contactDropdown');
  const button = document.querySelector('.contact-icon-btn');
  if (dropdown && !dropdown.contains(event.target) && !button.contains(event.target)) {
    setContactDropdown(false);
  }
});

// Close dropdown with Escape key
window.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') setContactDropdown(false);
});

// Handle #contact URL hash
function handleContactHash() {
  if (window.location.hash === '#contact' && document.getElementById('contactDropdown')) {
    setContactDropdown(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Listen for hash changes
window.addEventListener('hashchange', handleContactHash);

// GPS Modal Functions
let gpsModalOpener = null;

// Strava's embed script (and its cookies) only loads once someone actually
// opens the GPS modal; it renders any placeholders as soon as it runs.
function loadStravaEmbed() {
  if (document.getElementById('stravaEmbedScript')) return;
  const script = document.createElement('script');
  script.id = 'stravaEmbedScript';
  script.src = 'https://strava-embeds.com/embed.js';
  document.body.appendChild(script);
}

function openGPSModal() {
  trackEvent('gps_info_view');
  const modal = document.getElementById('gpsModal');
  loadStravaEmbed();
  gpsModalOpener = document.activeElement;
  modal.style.display = 'block';
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}

function closeGPSModal() {
  trackEvent('gps_info_close');
  const modal = document.getElementById('gpsModal');
  modal.style.display = 'none';
  // Restore body scroll
  document.body.style.overflow = '';
  if (gpsModalOpener) gpsModalOpener.focus();
}

// Outbound link click tracking
function trackOutboundClick(destination) {
  trackEvent('outbound_click', { destination });
}

// Close modal when clicking outside of modal content
window.addEventListener('click', function(event) {
  const modal = document.getElementById('gpsModal');
  if (event.target === modal) {
    closeGPSModal();
  }
});

// Close modal with Escape key
window.addEventListener('keydown', function(event) {
  const modal = document.getElementById('gpsModal');
  if (event.key === 'Escape' && modal && modal.style.display === 'block') {
    closeGPSModal();
  }
});

// Toggle review read more/less
function toggleReview(button) {
  const reviewCard = button.closest('.review-card');
  const ellipsis = reviewCard.querySelector('.review-preview:last-of-type');
  const fullText = reviewCard.querySelector('.review-full');

  trackEvent('review_toggle', { action: fullText.style.display === 'none' ? 'expand' : 'collapse' });

  if (fullText.style.display === 'none') {
    // Expand to show full review
    ellipsis.style.display = 'none';
    fullText.style.display = 'inline';
    button.textContent = 'Read less';
  } else {
    // Collapse to preview
    ellipsis.style.display = 'inline';
    fullText.style.display = 'none';
    button.textContent = 'Read more';
  }
}

// Shrink the header contact icon just enough to stop it overlapping the title.
// Icon is right-anchored (position: absolute; right: 1rem), so shrinking it
// automatically opens up room between it and the h1 as its own width shrinks.
const CONTACT_ICON_MAX = 24;
const CONTACT_ICON_MIN = 12;
const CONTACT_ICON_GAP = 4; // smallest gap allowed between title and icon

function fitContactIcon() {
  const h1 = document.querySelector('.header-content h1');
  const btn = document.querySelector('.contact-icon-btn');
  if (!h1 || !btn) return;

  // Reset both to their CSS-defined sizes before measuring, so repeated
  // calls (e.g. on resize) don't compound previous shrinking.
  h1.style.removeProperty('font-size');
  let size = CONTACT_ICON_MAX;
  btn.style.setProperty('--icon-size', `${size}px`);

  // h1 is a block element and spans the full header width regardless of
  // text length, so measure the rendered text itself via a Range instead
  // of h1.getBoundingClientRect().
  const textRange = document.createRange();
  textRange.selectNodeContents(h1);

  for (let i = 0; i < CONTACT_ICON_MAX - CONTACT_ICON_MIN; i++) {
    const textRect = textRange.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const gap = btnRect.left - textRect.right;
    if (gap >= CONTACT_ICON_GAP || size <= CONTACT_ICON_MIN) break;
    size -= 1;
    btn.style.setProperty('--icon-size', `${size}px`);
  }

  // On very narrow screens the title alone can be wider than the space
  // left after the icon is already at its floor size. As a last resort,
  // nudge the title down slightly too (never below 70% of its CSS size)
  // so the two never actually overlap.
  const baseFontSize = parseFloat(getComputedStyle(h1).fontSize);
  const fontFloor = baseFontSize * 0.7;
  let fontSize = baseFontSize;
  for (let i = 0; i < 40; i++) {
    const textRect = textRange.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const gap = btnRect.left - textRect.right;
    if (gap >= CONTACT_ICON_GAP || fontSize <= fontFloor) break;
    fontSize -= 1;
    h1.style.fontSize = `${fontSize}px`;
  }
}

let contactIconResizeTimeout = null;
function scheduleFitContactIcon() {
  if (contactIconResizeTimeout) clearTimeout(contactIconResizeTimeout);
  contactIconResizeTimeout = setTimeout(fitContactIcon, 100);
}

// Nudge the stats bar left/right on load, but only if it's actually wider
// than the viewport, as a subtle hint that it scrolls horizontally.
function initStatsScrollHint() {
  const el = document.querySelector('.stats-container');
  if (!el) return;
  if (el.scrollWidth <= el.clientWidth + 1) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  el.classList.add('scroll-hint');
  el.addEventListener('animationend', () => el.classList.remove('scroll-hint'), { once: true });
}

// Generate the collage on page load and handle #contact hash
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  generateCollage();
  handleContactHash();
  initLogoOptOut();
  fitContactIcon();
  initStatsScrollHint();
});

window.addEventListener('load', fitContactIcon);
window.addEventListener('resize', scheduleFitContactIcon);
