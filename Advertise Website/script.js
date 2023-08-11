'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// header.append(message);

message.addEventListener('click', function () {
  message.remove();
});

btnScrollTo.addEventListener('click', function () {
  // Old Way
  // const coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: coords.left + window.scrollX,
  //   top: coords.top + window.scrollX,
  //   behavior: 'smooth',
  // });
  document.querySelector('#section--1').scrollIntoView({ behavior: 'smooth' });
});

// Slow performance
// document.querySelectorAll('.nav__link').forEach(function (nav) {
//   nav.addEventListener('click', function (e) {
//     e.preventDefault();
//     document
//       .querySelector(this.getAttribute('href'))
//       .scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link'))
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
});

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

const observer = new IntersectionObserver(
  entries => {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  }
);
observer.observe(header);

const sectionObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0.15,
  }
);

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(
  (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () =>
      entry.target.classList.remove('lazy-img')
    );
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0,
    rootMargin: '-200px',
  }
);

imgTargets.forEach(img => imgObserver.observe(img));

let currentSlide = 0;
const maxLenght = slides.length - 1;

const transformSlides = function (index) {
  slides.forEach(
    (slide, i) => (slide.style.transform = `translateX(${100 * (i - index)}%)`)
  );
};
// slider.style.transform = 'scale(0.3)';
// slider.style.overflow = 'visible';

transformSlides(0);

const nextSlide = function () {
  if (currentSlide === maxLenght) currentSlide = 0;
  else currentSlide++;
  transformSlides(currentSlide);
  activateDot(currentSlide);
};
const previousSlide = function () {
  if (currentSlide === 0) currentSlide = maxLenght;
  else currentSlide--;
  transformSlides(currentSlide);
  activateDot(currentSlide);
};

btnSliderRight.addEventListener('click', nextSlide);

btnSliderLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && previousSlide();
  e.key === 'ArrowRight' && nextSlide();
});

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
const activateDot = function (index) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${index}"]`)
    .classList.add('dots__dot--active');
};
createDots();
activateDot(0);

dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  currentSlide = +e.target.dataset.slide;
  transformSlides(currentSlide);
  activateDot(currentSlide);
});
