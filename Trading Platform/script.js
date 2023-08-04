'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;

  moves.forEach(function (mov, i, arr) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
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
  labelBalance.textContent = account.balance + '€';
};

const calcDisplaySummary = function (account) {
  labelSumIn.textContent =
    account.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0) + '€';

  labelSumOut.textContent =
    Math.abs(
      account.movements
        .filter(mov => mov <= 0)
        .reduce((acc, mov) => acc + mov, 0)
    ) + '€';

  labelSumInterest.textContent =
    account.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + (mov * account.interestRate) / 100, 0) + '€';
};

const updateUi = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

createUsernames(accounts);

let currentAccout;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccout = accounts.find(
    account =>
      account.UserName === inputLoginUsername.value &&
      account.pin === Number(inputLoginPin.value)
  );

  if (currentAccout) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccout.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    updateUi(currentAccout);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

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
  updateUi(currentAccout);

  userToTransfer.movements.push(amount);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccout.UserName === inputCloseUsername.value &&
    currentAccout.pin === Number(inputClosePin.value)
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
  const requestedLoan = Number(inputLoanAmount.value);

  if (
    requestedLoan > 0 &&
    currentAccout.movements.some(mov => mov > 0.1 * requestedLoan)
  ) {
    currentAccout.movements.push(requestedLoan);
    updateUi(currentAccout);
  }

  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  sorted = !sorted;
  displayMovements(currentAccout.movements, sorted);
});

// const temp = function (str) {
//   return str
//     .split(' ')
//     .map(item => {
//       return item[0].toUpperCase() + item.slice(1);
//     })
//     .join(' ');
// };

// console.log(temp('this is a string'));

const eatingWell = function (dog) {
  return (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  );
};

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
});

const dog = dogs.find(dog => {
  return dog.owners.includes('Sarah');
});

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood * 0.9)
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood * 1.1)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch.join(' and ') + "'s dogs eat too much!");
console.log(ownersEatTooLittle.join(' and ') + "'s dogs eat too little!");

const dog1 = dogs.some(dog => dog.recommendedFood === dog.curFood);
const dog2 = dogs.some(eatingWell);
const dog3 = dogs.filter(eatingWell);
console.log(dog1);
console.log(dog2);
console.log(dog3);

const otherDogs = dogs.slice().sort((a, b) => a.curFood - b.curFood);
console.log(otherDogs);
