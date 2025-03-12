class FinanceTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.investments = JSON.parse(localStorage.getItem('investments')) || [];
        this.init();
    }

    init() {
        document.getElementById('transaction-form').addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        document.getElementById('investment-form').addEventListener('submit', (e) => this.handleInvestmentSubmit(e));
        this.updateUI();
    }

    // Transaction Handling
    handleTransactionSubmit(e) {
        e.preventDefault();
        
        const transaction = {
            id: Date.now(),
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            type: document.getElementById('type').value
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateUI();
        e.target.reset();
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    // Investment Handling
    handleInvestmentSubmit(e) {
        e.preventDefault();
        
        const investment = {
            id: Date.now(),
            name: document.getElementById('investment-name').value,
            value: parseFloat(document.getElementById('investment-value').value)
        };

        this.investments.push(investment);
        this.saveInvestments();
        this.updateUI();
        e.target.reset();
    }

    saveInvestments() {
        localStorage.setItem('investments', JSON.stringify(this.investments));
    }

    // Calculations
    calculateSummary() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = income - expenses;

        return { income, expenses, balance };
    }

    calculateMeanSpending() {
        const expenses = this.transactions.filter(t => t.type === 'expense');
        if (expenses.length === 0) return 0;
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        return totalExpenses / expenses.length;
    }

    calculateInvestments() {
        return this.investments.reduce((sum, inv) => sum + inv.value, 0);
    }

    // UI Updates
    updateUI() {
        const { income, expenses, balance } = this.calculateSummary();
        const meanSpending = this.calculateMeanSpending();
        const totalInvestments = this.calculateInvestments();

        // Summary
        document.getElementById('total-balance').textContent = `KES ${balance.toFixed(2)}`;
        document.getElementById('total-income').textContent = `KES ${income.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `KES ${expenses.toFixed(2)}`;

        // Income Statement
        document.getElementById('statement-income').textContent = `KES ${income.toFixed(2)}`;
        document.getElementById('statement-expenses').textContent = `KES ${expenses.toFixed(2)}`;
        const netIncomeEl = document.getElementById('net-income');
        netIncomeEl.textContent = `KES ${balance.toFixed(2)}`;
        netIncomeEl.classList.toggle('negative', balance < 0);

        // Mean Spending
        document.getElementById('mean-spending').textContent = `KES ${meanSpending.toFixed(2)}`;

        // Investment Portfolio
        document.getElementById('total-investments').textContent = `KES ${totalInvestments.toFixed(2)}`;
        const investmentList = document.getElementById('investment-list');
        investmentList.innerHTML = '';
        this.investments.forEach(inv => {
            const li = document.createElement('li');
            li.classList.add('investment-item');
            li.innerHTML = `<span>${inv.name}</span><span>KES ${inv.value.toFixed(2)}</span>`;
            investmentList.appendChild(li);
        });

        // Transaction History
        const transactionList = document.getElementById('transaction-list');
        transactionList.innerHTML = '';
        this.transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.classList.add('transaction-item', transaction.type);
            li.innerHTML = `
                <span>${transaction.description}</span>
                <span>${transaction.type === 'income' ? '+' : '-'}KES ${transaction.amount.toFixed(2)}</span>
            `;
            transactionList.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FinanceTracker();
});