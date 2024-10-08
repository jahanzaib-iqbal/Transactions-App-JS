'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jahanzaib Iqbal',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Zunain Ali',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Abdul Rehman',
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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce(function (acc, current) {
    return acc + current;
  }, 0);
  labelBalance.textContent = `${acc.balance} €`;
}

const calcDisplaySummary = function (acc) {
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${deposit}€`;
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
  //Bank interest 10% of the deposit amount
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc, i, accounts) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (names) {
        return names[0];
      })
      .join('');

    // console.log(acc);
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplaySummary(acc);
  calcPrintBalance(acc);
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //prevent the default behaviour of button, i.e reload the page on clicked

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase()
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log(currentAccount.pin)
    labelWelcome.innerHTML = `Welcome Back <b>${
      currentAccount.owner.split(' ')[0]
    }<b>`;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
  } else alert(`Invalid Account,
  Accounts Information: 
  Usernames  |  Password | Account Names
  ----------------------------------------
      ji          1111     Jahanzaib Iqbal
      za          2222     Zunain Ali
      ar          3333     Abdul Rehmann
      ss          4444     Sarah Smith`);
});

// Transfer Amount

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    currentAccount.balance >= amount &&
    amount > 0 &&
    reciverAcount &&
    reciverAcount?.username !== currentAccount.username
  ) {
    reciverAcount.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
    inputTransferAmount.blur();
    inputTransferTo.blur();

    console.log(`${amount} transferred to ${reciverAcount.owner}`);
  } else console.log('Invalaid Transfer');
});
      
// Delete User / Close Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(`Account ${currentAccount.owner} Closed`);
  }
  inputClosePin.value = inputCloseUsername.value = '';
});



// Request a loan : only if there is any deposit amount greater or equal than 10% of requested amount

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const reqAmount = Number(inputLoanAmount.value)
  if(reqAmount>0 && currentAccount.movements.some(mov => mov>= 0.1*reqAmount) ){
    currentAccount.movements.push(reqAmount)

    updateUI(currentAccount)
  }
  else console.log('Loan Denied')
  inputLoanAmount = ''
})
