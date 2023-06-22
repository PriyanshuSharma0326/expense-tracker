// Page Numbers
const currentBalanceElement = document.getElementById('current-balance');
const incomeBalanceElement = document.getElementById('income-amount');
const expenseBalanceElement = document.getElementById('expense-amount');

// Form Elements
const formElement = document.getElementById('input-form');
const formNameInput = document.getElementById('transaction-name-input');
const formAmountInput = document.getElementById('transaction-amount-input');
const formIncomeInput = document.getElementById('transaction-type-income');
const formExpenseInput = document.getElementById('transaction-type-expense');

// Transaction History
const transactionList = document.getElementById('transactions-container');

// Global Varlables
let currentBalance = 0;
let incomeBalance = 0;
let expenseBalance = 0;
let transactions = [];
let itemToEdit = null;
let updating = false;

const init = () => {
    if(JSON.parse(localStorage.getItem('transactions'))) {
        transactions = JSON.parse(localStorage.getItem('transactions'));
    }
    else {
        transactions = [];
    }
    

    incomeBalanceElement.innerText = `₹${(incomeBalance).toFixed(2)}`;
    expenseBalanceElement.innerText = `₹${(expenseBalance).toFixed(2)}`;
    currentBalanceElement.innerText = `₹${(currentBalance).toFixed(2)}`;

    updateDOM();
}

const deleteTransaction = (transactionID) => {
    transactions = transactions?.filter(transaction => transaction.id !== transactionID);

    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateDOM();
}

const updateTransaction = (transactionID) => {
    transactions.forEach(transaction => {
        if(transaction.id === transactionID) {
            transaction.name = formNameInput.value;
            transaction.amount = Number(formAmountInput.value);
            transaction.type = (formIncomeInput.checked === true ?  'income' : 'expense');
        }
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const editTransaction = (transactionID) => {
    updating = true;
    itemToEdit = transactionID;
    transactions?.map(transaction => {
        if(transaction.id === transactionID) {
            formNameInput.value = transaction.name;
            formAmountInput.value = transaction.amount;
            if(transaction.type === 'income') {
                formIncomeInput.checked = true;
            }
            else if(transaction.type === 'expense') {
                formExpenseInput.checked = true;
            }
        }
    });
}

const createTransactionElement = (transactionID) => {
    const newTransactionElement = document.createElement('div');
    newTransactionElement.classList = 'transaction';

    const deleteButtonElement = document.createElement('button');
    deleteButtonElement.classList = 'delete-button';
    deleteButtonElement.id = 'delete-button';
    deleteButtonElement.innerHTML = `
        <img class="delete-icon" src="./media/remove.png" alt="">
    `;
    deleteButtonElement.onclick = () => {
        deleteTransaction(transactionID);
    }

    const editButtonElement = document.createElement('button');
    editButtonElement.classList = 'edit-button';
    editButtonElement.id = 'edit-button';
    editButtonElement.innerHTML = `
        <img class="edit-icon" src="./media/edit.png" alt="">
    `;
    editButtonElement.onclick = () => {
        editTransaction(transactionID);
    }

    const transactionElementText = document.createElement('div');
    transactionElementText.classList = 'transaction-text';

    newTransactionElement.appendChild(deleteButtonElement);
    newTransactionElement.appendChild(transactionElementText);
    newTransactionElement.appendChild(editButtonElement);

    const transactionName = document.createElement('text');
    transactionName.classList = 'transaction-name';

    const transactionAmount = document.createElement('text');
    transactionAmount.classList = 'transaction-amount';

    return {newTransactionElement, transactionElementText, transactionName, transactionAmount};
}

const setTransactions = () => {
    transactionList.innerHTML = null;

    transactions.map(transaction => {
        const {newTransactionElement, transactionElementText, transactionName, transactionAmount} = createTransactionElement(transaction.id);

        if(transaction.type === 'income') {
            transactionAmount.classList.add('positive')
        }
        else if(transaction.type === 'expense') {
            transactionAmount.classList.add('negative');
        }
        transactionName.innerText = transaction.name;
        transactionAmount.innerText = `₹${transaction.amount}`;

        transactionElementText.appendChild(transactionName);
        transactionElementText.appendChild(transactionAmount);
        transactionList.appendChild(newTransactionElement);
    });
}

const clearForm = () => {
    formNameInput.value = null;
    formAmountInput.value = null;
    formIncomeInput.checked = false;
    formExpenseInput.checked = false;
}

const updateDOM = () => {
    incomeBalance = 0;
    expenseBalance = 0;

    if(transactions.length) {
        for(let i = 0; i < transactions.length; i++) {
            if(transactions[i].type === 'income') {
                incomeBalance += transactions[i].amount;
            }
            else if(transactions[i].type === 'expense') {
                expenseBalance += transactions[i].amount;
            }
        }
    }

    incomeBalanceElement.innerText = `₹${incomeBalance}`;
    expenseBalanceElement.innerText = `₹${expenseBalance}`;

    currentBalance = incomeBalance - expenseBalance;
    currentBalanceElement.innerText = `₹${currentBalance}`;
    setTransactions();
}

const addTransactionToList = () => {
    const newTransaction = {
        id: Date.now(),
        name: formNameInput.value,
        amount: Number(formAmountInput.value),
        type: formIncomeInput.checked ? formIncomeInput.value : formExpenseInput.value
    }
    transactions.push(newTransaction);

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

formElement.addEventListener('submit', (event) => {
    event.preventDefault();

    if(updating) {
        updateTransaction(itemToEdit);
        updating = false;
        itemToEdit = null;
    }
    else {
        addTransactionToList(); 
    }

    updateDOM();
    clearForm();
});

init();
