'use strict';

const diceEl = document.querySelector('.dice');
const holdEl = document.querySelector('.btn--hold');
const resetEl = document.querySelector('.btn--new');
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');

let currenScore, activePlayer, gameIsOver, scores;

const switchPlayer = function () {
  currenScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent = currenScore;
  activePlayer = activePlayer ? 0 : 1;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

const init = function () {
  diceEl.classList.add('hidden');
  activePlayer = 0;
  currenScore = 0;
  gameIsOver = false;
  scores = [0, 0];

  for (let i = 0; i < scores.length; ++i) {
    document.querySelector(`#score--${i}`).textContent = scores[i];
    document.getElementById(`current--${i}`).textContent = currenScore;
    document.querySelector(`.player--${i}`).classList.remove('player--winner');
    i === 0
      ? document.querySelector(`.player--${i}`).classList.add('player--active')
      : document
          .querySelector(`.player--${i}`)
          .classList.remove('player--active');
  }
};

init();

document.querySelector('.btn--roll').addEventListener('click', () => {
  if (gameIsOver) return;
  const randomNumber = Math.trunc(Math.random() * 6) + 1;
  diceEl.src = `dice-${randomNumber}.png`;
  diceEl.classList.remove('hidden');

  if (randomNumber === 1) {
    switchPlayer();
  } else {
    currenScore += randomNumber;
    document.getElementById(`current--${activePlayer}`).textContent =
      currenScore;
  }
});

holdEl.addEventListener('click', () => {
  if (gameIsOver) return;
  scores[activePlayer] += currenScore;
  document.querySelector(`#score--${activePlayer}`).textContent =
    scores[activePlayer];

  if (scores[activePlayer] >= 100) {
    gameIsOver = true;
    diceEl.classList.add('hidden');
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.add('player--winner');
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.remove('player--active');
  } else {
    switchPlayer();
  }
});

resetEl.addEventListener('click', init);
