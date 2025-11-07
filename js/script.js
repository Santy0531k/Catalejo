// Carrusel sin dependencias
document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  const slidesContainer = carousel.querySelector('.slides');
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const prevBtn = carousel.parentElement.querySelector('.control.prev');
  const nextBtn = carousel.parentElement.querySelector('.control.next');
  const indicatorsWrap = carousel.parentElement.querySelector('.indicators');

  let index = 0;
  let autoplay = true;
  let intervalId = null;
  const AUTOPLAY_MS = 4500;

  // crear indicadores
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Ir a slide ${i + 1}`);
    btn.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    indicatorsWrap.appendChild(btn);
  });
  const indicators = Array.from(indicatorsWrap.querySelectorAll('button'));

  function updateUI() {
    // mover slides
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    // actualizar indicadores
    indicators.forEach((b, i) => b.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    updateUI();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // controles
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  // teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
    if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
  });

  // autoplay
  function startAutoplay() {
    if (intervalId) return;
    intervalId = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (!intervalId) return;
    clearInterval(intervalId); intervalId = null;
  }
  function resetAutoplay() {
    stopAutoplay();
    if (autoplay) startAutoplay();
  }

  // pausar al hover
  carousel.parentElement.addEventListener('mouseenter', stopAutoplay);
  carousel.parentElement.addEventListener('mouseleave', () => { if (autoplay) startAutoplay(); });

  // primer render
  updateUI();
  if (autoplay) startAutoplay();

  // accesibilidad: si el usuario tabula a los indicadores, mostrar foco
  indicators.forEach((btn) => {
    btn.addEventListener('focus', stopAutoplay);
    btn.addEventListener('blur', () => { if (autoplay) startAutoplay(); });
  });
});
