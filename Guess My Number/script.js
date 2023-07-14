'use strict';

let randomNumber = Math.trunc(Math.random() * 20) + 1;
let score = Number(document.querySelector('.score').textContent);
let highScore = Number(document.querySelector('.highscore').textContent);
console.log(randomNumber);

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

const lost = function () {
  displayMessage('You lost!');
  document.querySelector('.guess').disabled = true;
  document.querySelector('.check').disabled = true;
};

document.querySelector('.check').addEventListener('click', () => {
  const guess = Number(document.querySelector('.guess').value);
  if (!guess) {
    displayMessage('No Number is entered!');
    return;
  }

  if (guess === randomNumber) {
    displayMessage('Correct!');
    document.querySelector('body').style.backgroundColor = 'green';
    document.querySelector('.number').style.width = '30rem';
    document.querySelector('.number').textContent = randomNumber;
    highScore = score > highScore ? score : highScore;
    document.querySelector('.highscore').textContent = highScore;
    document.querySelector('.check').disabled = true;
    return;
  }
  if (score <= 0) {
    lost();
    return;
  }
  document.querySelector('.score').textContent = --score;

  displayMessage(guess > randomNumber ? 'Too high!' : 'Too low!');
});

document.querySelector('.again').addEventListener('click', () => {
  randomNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.number').textContent = '?';
  document.querySelector('body').style.backgroundColor = '#222';
  displayMessage('Start guessing...');
  score = 20;
  document.querySelector('.score').textContent = score;
  document.querySelector('.guess').value = '';
  document.querySelector('.check').disabled = false;
});
