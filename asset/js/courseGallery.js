// Lazy loading
const lazyImages = document.querySelectorAll('.lazy');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.onload = () => img.classList.add('loaded');
      obs.unobserve(img);
    }
  });
});
lazyImages.forEach(img => observer.observe(img));

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const durationText = document.getElementById('lightbox-duration');
const closeBtn = document.getElementById('close-lightbox');

let currentIndex = -1;

function openLightbox(index) {
  const img = lazyImages[index];
  lightboxImg.src = img.dataset.src;
  durationText.textContent = `Duration: ${img.dataset.duration}`;
  lightbox.classList.remove('hidden');
  currentIndex = index;
}

lazyImages.forEach((img, index) => {
  img.addEventListener('click', () => openLightbox(index));
});

closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'Escape') lightbox.classList.add('hidden');
  if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % lazyImages.length);
  if (e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + lazyImages.length) % lazyImages.length);
});

// Touch support
let startX = 0;
lightbox.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
lightbox.addEventListener('touchend', (e) => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) openLightbox((currentIndex + 1) % lazyImages.length); // swipe left
  else if (endX - startX > 50) openLightbox((currentIndex - 1 + lazyImages.length) % lazyImages.length); // swipe right
});
