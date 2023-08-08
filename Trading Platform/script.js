'use strict';

// BANKIST APP

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2023-08-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
let currentAccout, timer;

const startLogOutTimer = function () {
  const tick = function () {
    const min = Math.trunc(time / 60)
      .toString()
      .padStart(2, '0');
    const second = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${min}:${second}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    --time;
  };
  let time = 120;
  tick();

  const timer = setInterval(tick, 1000);
  return timer;
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  Math.round(Math.abs(date - new Date()) / (1000 * 60 * 60 * 24));

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  moves.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const dateTime = formatMovementDate(
      new Date(acc.movementsDates[i]),
      acc.locale
    );

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${dateTime}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (users) {
  users.forEach(function (account) {
    account.UserName = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, number) => acc + number, 0);
  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};

const calcDisplaySummary = function (account) {
  labelSumIn.textContent = formatCur(
    account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0),
    account.locale,
    account.currency
  );

  labelSumOut.textContent = formatCur(
    Math.abs(
      account.movements
        .filter(mov => mov <= 0)
        .reduce((acc, mov) => acc + mov, 0)
    ),
    account.locale,
    account.currency
  );

  labelSumInterest.textContent = formatCur(
    account.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + (mov * account.interestRate) / 100, 0),
    account.locale,
    account.currency
  );
};

const updateUi = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

createUsernames(accounts);

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccout = accounts.find(
    account =>
      account.UserName === inputLoginUsername.value &&
      account.pin === +inputLoginPin.value
  );

  if (currentAccout) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccout.owner.split(' ')[0]
    }`;

    const now = new Date();
    const opetins = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    const locale = currentAccout.locale;
    labelDate.textContent = new Intl.DateTimeFormat(locale, opetins).format(
      now
    );

    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUi(currentAccout);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;

  const userToTransfer = accounts.find(
    acc => acc.UserName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    !userToTransfer ||
    amount <= 0 ||
    currentAccout.balance < amount ||
    currentAccout.UserName === userToTransfer.UserName
  )
    return;

  currentAccout.movements.push(-amount);
  currentAccout.movementsDates.push(new Date().toISOString());
  updateUi(currentAccout);

  userToTransfer.movements.push(amount);
  userToTransfer.movementsDates.push(new Date().toISOString());

  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccout.UserName === inputCloseUsername.value &&
    currentAccout.pin === +inputClosePin.value
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc.UserName === currentAccout.UserName),
      1
    );
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestedLoan = Math.floor(inputLoanAmount.value);

  if (
    requestedLoan > 0 &&
    currentAccout.movements.some(mov => mov > 0.1 * requestedLoan)
  ) {
    setTimeout(function () {
      currentAccout.movements.push(requestedLoan);
      currentAccout.movementsDates.push(new Date().toISOString());
      updateUi(currentAccout);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  sorted = !sorted;
  displayMovements(currentAccout, sorted);
});

const eatingWell = function (dog) {
  return (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  );
};

//Fake UI
// currentAccout = account1;
// updateUi(account1);
// containerApp.style.opacity = 100;
