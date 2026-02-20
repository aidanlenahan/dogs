// Theme Toggle Functionality
function toggleTheme() {
  const root = document.documentElement;
  const themeIcon = document.getElementById('themeIcon');
  const currentTheme = root.classList.contains('light-mode') ? 'dark' : 'light';
  
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
  { src: `${imageDir}/stella1.jpg`, alt: 'Stella' }
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
function email() {
  window.location.href = "mailto:aidan@aidanlenahan.com";
}

// Facebook navigation function
function fb() {
  window.open("https://facebook.com/lenahanaidan", "_blank");
}

// Toggle contact dropdown with icon swap
function toggleContactDropdown() {
  const dropdown = document.getElementById('contactDropdown');
  const icon = document.getElementById('contactIcon');
  const isActive = dropdown.classList.toggle('active');
  
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

// Generate the collage on page load and handle #contact hash
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  generateCollage();
  handleContactHash();
});
