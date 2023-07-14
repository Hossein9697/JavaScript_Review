'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

const toggleElementHidden = function (elementArray) {
  for (let i = 0; i < elementArray.length; ++i) {
    elementArray[i].classList.contains('hidden')
      ? elementArray[i].classList.remove('hidden')
      : elementArray[i].classList.add('hidden');
  }
};

for (let i = 0; i < btnsOpenModal.length; ++i) {
  btnsOpenModal[i].addEventListener('click', () => {
    toggleElementHidden([modal, overlay]);
    // btnsOpenModal[i].textContent = `This is ${i}'s`;
  });
}

btnCloseModal.addEventListener('click', function () {
  toggleElementHidden([modal, overlay]);
});

overlay.addEventListener('click', function () {
  toggleElementHidden([modal, overlay]);
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    toggleElementHidden([modal, overlay]);
  }
});
