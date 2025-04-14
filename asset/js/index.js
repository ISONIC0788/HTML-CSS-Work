// Theme Toggle Logic
const themeSelector = document.getElementById('theme-selector');
const body = document.body;

// Function to set the theme
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
}

// Event listener for theme change
themeSelector.addEventListener('change', () => {
    setTheme(themeSelector.value);
});

// Check for OS preference and saved theme on load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
        themeSelector.value = 'dark';
    }
});

// Menu icon logic
const menuIcon = document.getElementById('menuicon');
const menuList = document.getElementById('menulist');

menuIcon.addEventListener('click', () => {
    menuList.classList.toggle('show-menu');
});

// Course Gallery
const galleryContainer = document.querySelector('.gallery-container');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxDuration = document.getElementById('lightbox-duration');
const lightboxClose = document.querySelector('.lightbox-close');
let currentImageIndex = 0;
const courseImages = document.querySelectorAll('.course-image');

// Lazy Loading (Intersection Observer)
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src; // Replace placeholder src
            observer.unobserve(img);
        }
    });
});

courseImages.forEach(img => {
    imageObserver.observe(img);
});

// Lightbox Functionality
function openLightbox(index) {
    lightbox.style.display = 'block';
    lightboxImage.src = courseImages[index].src;
    lightboxDuration.textContent = courseImages[index].dataset.duration;
    currentImageIndex = index;
}

function closeLightbox() {
    lightbox.style.display = 'none';
}

galleryContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('course-image')) {
        const index = Array.from(courseImages).indexOf(e.target);
        openLightbox(index);
    }
});

lightboxClose.addEventListener('click', closeLightbox);

// Lightbox Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + courseImages.length) % courseImages.length;
            openLightbox(currentImageIndex);
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % courseImages.length;
            openLightbox(currentImageIndex);
        }
    }
});

// Live Clocks
const analogClock = document.querySelector('.analog-clock');
const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');
const digitalTime = document.getElementById('digital-time');

function updateClocks() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Analog Clock
    const hourRotation = (hours % 12 + minutes / 60) * 30;
    const minuteRotation = (minutes + seconds / 60) * 6;
    const secondRotation = seconds * 6;

    hourHand.style.transform = `translate(-50%, -100%) rotate(${hourRotation}deg)`;
    minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteRotation}deg)`;
    secondHand.style.transform = `translate(-50%, -100%) rotate(${secondRotation}deg)`;

    // Digital Clock
    const digitalTimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    digitalTime.textContent = digitalTimeString;
}

setInterval(updateClocks, 1000); // Update every second
updateClocks(); // Initial call

// Form Validation
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const passwordStrength = document.getElementById('passwordStrength');
const submitButton = document.getElementById('submitButton');
const registrationForm = document.getElementById('registrationForm');

function validateEmail() {
    const emailValue = emailInput.value.trim();
    if (!emailValue.endsWith('@techinnovators.com')) {
        emailError.textContent = 'Email must end with @techinnovators.com';
        return false;
    } else {
        emailError.textContent = '';
        return true;
    }
}

function validatePassword() {
    const passwordValue = passwordInput.value;
    const hasNumber = /[0-9]/.test(passwordValue);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

    let strength = '';
    if (passwordValue.length >= 8 && hasNumber && hasSpecialChar) {
        strength = 'Strong';
    } else if (passwordValue.length >= 6 || hasNumber || hasSpecialChar) {
        strength = 'Medium';
    } else {
        strength = 'Weak';
    }

    passwordStrength.textContent = `Strength: ${strength}`;

    if (passwordValue.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters';
        return false;
    } else if (!hasNumber) {
        passwordError.textContent = 'Password must contain at least one number';
        return false;
    } else if (!hasSpecialChar) {
        passwordError.textContent = 'Password must contain at least one special character';
        return false;
    } else {
        passwordError.textContent = '';
        return true;
    }
}

function updateSubmitButtonState() {
    submitButton.disabled = !validateEmail() || !validatePassword();
}

emailInput.addEventListener('input', () => {
    validateEmail();
    updateSubmitButtonState();
});

passwordInput.addEventListener('input', () => {
    validatePassword();
    updateSubmitButtonState();
});

registrationForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission for demonstration
    if (validateEmail() && validatePassword()) {
        alert('Registration Successful!');
        // You would typically send the data to a server here
    }
});

// FAQ Section
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');

        // Close other open answers
        faqQuestions.forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.style.maxHeight = null;
        });

        if (!isActive) {
            question.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// Mobile Touch Support (Lightbox)
let touchStartX = 0;
let touchEndX = 0;

lightboxImage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightboxImage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right
            currentImageIndex = (currentImageIndex - 1 + courseImages.length) % courseImages.length;
        } else {
            // Swipe left
            currentImageIndex = (currentImageIndex + 1) % courseImages.length;
        }
        openLightbox(currentImageIndex);
    }
}