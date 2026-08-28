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

// Load saved theme preference on page load
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const root = document.documentElement;
  const themeIcon = document.getElementById('themeIcon');
  
  // Default to dark mode, only switch to light if explicitly saved
  if (savedTheme === 'light') {
    root.classList.add('light-mode');
    if (themeIcon) {
      themeIcon.src = 'img/icons/dark.png';
    }
  }
}

// Define the image directory path
const imageDir = './img';

// List of all dog images
const dogImages = [
  { src: `${imageDir}/rosco.jpeg`, alt: 'Rosco' },
  { src: `${imageDir}/stella.jpg`, alt: 'Stella' },
  { src: `${imageDir}/reef.jpg`, alt: 'Reef' },
  { src: `${imageDir}/mak.jpeg`, alt: 'Mak' },
  { src: `${imageDir}/makreef.jpeg`, alt: 'Mak and Reef' },
  { src: `${imageDir}/lady.jpeg`, alt: 'Lady' },
  { src: `${imageDir}/lola.jpg`, alt: 'Lola' },
  { src: `${imageDir}/ziggy.jpg`, alt: 'Ziggy' },
  { src: `${imageDir}/bruno.jpg`, alt: 'Bruno' },
  { src: `${imageDir}/charlie.jpeg`, alt: 'Charlie' },
  { src: `${imageDir}/chuck.jpg`, alt: 'Chuck' },
  { src: `${imageDir}/nala.jpg`, alt: 'Nala' },
  { src: `${imageDir}/nalaz.jpg`, alt: 'Nala' },
  { src: `${imageDir}/stella1.jpg`, alt: 'Stella' },
  { src: `${imageDir}/bordercollie.jpg`, alt: 'Border Collie' },
  { src: `${imageDir}/shepherdmix.jpg`, alt: 'Shepherd mix' },
  { src: `${imageDir}/bernese.jpg`, alt: 'Bernese Mountain Dog' },
  { src: `${imageDir}/cavalier.jpg`, alt: 'Cavalier mix' },
  { src: `${imageDir}/cockapoo.jpg`, alt: 'Cockapoo' }
];

// Function to generate a random collage of images
function generateCollage() {
  const collageContainer = document.querySelector('.collage-container');
  
  if (!collageContainer) return;

  // Randomly shuffle the images and select 4
  const shuffledImages = [...dogImages]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  // Create and append image elements
  shuffledImages.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.src;
    imgElement.alt = image.alt;
    imgElement.classList.add('collage-image');
    imgElement.loading = 'lazy';
    collageContainer.appendChild(imgElement);
  });
}

// Email function
function email(location = 'cta') {
  trackContactClick('email', location);
  window.location.href = "mailto:aidan@aidanlenahan.com";
}

// Facebook navigation function
function fb(location = 'cta') {
  trackContactClick('facebook', location);
  window.open("https://facebook.com/lenahanaidan", "_blank");
}

// Toggle contact dropdown with icon swap
function toggleContactDropdown() {
  const dropdown = document.getElementById('contactDropdown');
  const icon = document.getElementById('contactIcon');
  const isActive = dropdown.classList.toggle('active');

  if (isActive) {
    trackEvent('contact_dropdown_open');
  }

  // Swap icon with fade effect
  if (isActive) {
    icon.style.opacity = '0';
    setTimeout(() => {
      icon.src = 'img/icons/close.png';
      icon.style.opacity = '1';
    }, 150);
  } else {
    icon.style.opacity = '0';
    setTimeout(() => {
      icon.src = 'img/icons/contact.svg';
      icon.style.opacity = '1';
    }, 150);
  }
}

// Open contact dropdown (for links)
function openContactDropdown(event) {
  event.preventDefault();
  const dropdown = document.getElementById('contactDropdown');
  const icon = document.getElementById('contactIcon');
  
  if (!dropdown.classList.contains('active')) {
    dropdown.classList.add('active');
    icon.style.opacity = '0';
    setTimeout(() => {
      icon.src = 'img/icons/close.png';
      icon.style.opacity = '1';
    }, 150);
  }
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('contactDropdown');
  const button = document.querySelector('.contact-icon-btn');
  const contactLinks = document.querySelectorAll('.contact-link');
  
  // Check if click is on a contact link
  let isContactLink = false;
  contactLinks.forEach(link => {
    if (link.contains(event.target)) {
      isContactLink = true;
    }
  });
  
  if (dropdown && !dropdown.contains(event.target) && !button.contains(event.target) && !isContactLink) {
    if (dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      const icon = document.getElementById('contactIcon');
      icon.style.opacity = '0';
      setTimeout(() => {
        icon.src = 'img/icons/contact.svg';
        icon.style.opacity = '1';
      }, 150);
    }
  }
});

// Handle #contact URL hash
function handleContactHash() {
  if (window.location.hash === '#contact') {
    const dropdown = document.getElementById('contactDropdown');
    const icon = document.getElementById('contactIcon');
    
    if (!dropdown.classList.contains('active')) {
      dropdown.classList.add('active');
      icon.style.opacity = '0';
      setTimeout(() => {
        icon.src = 'img/icons/close.png';
        icon.style.opacity = '1';
      }, 150);
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Listen for hash changes
window.addEventListener('hashchange', handleContactHash);

// GPS Modal Functions
function openGPSModal() {
  trackEvent('gps_info_view');
  const modal = document.getElementById('gpsModal');
  modal.style.display = 'block';
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
}

function closeGPSModal() {
  trackEvent('gps_info_close');
  const modal = document.getElementById('gpsModal');
  modal.style.display = 'none';
  // Restore body scroll
  document.body.style.overflow = 'auto';
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

// Generate the collage on page load and handle #contact hash
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  generateCollage();
  handleContactHash();
  initLogoOptOut();
});
