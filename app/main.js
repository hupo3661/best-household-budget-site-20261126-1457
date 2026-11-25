// Router and event handling for HomeBudget. Hash routes, one page each:
//   #/                dashboard
//   #/transactions    the ledger, with add / edit / delete
//   #/budgets         category limits, editable
//   #/savings         goals and the savings calculator
//   #/bills           due, overdue and paid bills
//   #/reports         six months of charts and tables
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { budgetsPage, dashboard, missing, reportsPage, savingsPage, billsPage, transactionsPage, ui } from './views.js';
import { addTransaction, addToGoal, deleteTransaction, setBillStatus, state, updateBudget } from './state.js';

const app = document.getElementById('app');
const titles = {
  '#/': 'HomeBudget — Household Budget Planner',
  '#/transactions': 'Transactions | HomeBudget',
  '#/budgets': 'Budgets | HomeBudget',
  '#/savings': 'Savings goals | HomeBudget',
  '#/bills': 'Bills | HomeBudget',
  '#/reports': 'Reports | HomeBudget',
};

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const page = titles[hash] ? hash : '#/';
  document.title = titles[page];
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', ('#' + a.getAttribute('href').slice(1) === page) || (a.getAttribute('href') === '#/' && page === '#/'));
  });
  if (page === '#/') app.innerHTML = dashboard();
  else if (page === '#/transactions') app.innerHTML = transactionsPage();
  else if (page === '#/budgets') app.innerHTML = budgetsPage();
  else if (page === '#/savings') app.innerHTML = savingsPage();
  else if (page === '#/bills') app.innerHTML = billsPage();
  else if (page === '#/reports') app.innerHTML = reportsPage();
  else app.innerHTML = missing();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function readNumber(el, fallback) {
  const n = Number(el && el.value);
  return Number.isFinite(n) ? n : fallback;
}

// All clicks on buttons inside the app go through here.
app.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'delete-tx') {
    deleteTransaction(Number(btn.dataset.id));
    render();
  } else if (action === 'edit-tx') {
    ui.editingTxId = Number(btn.dataset.id);
    render();
  } else if (action === 'cancel-edit') {
    ui.editingTxId = null;
    render();
  } else if (action === 'save-edit') {
    const t = state.transactions.find((x) => x.id === Number(btn.dataset.id));
    if (t) {
      const date = document.getElementById('edit-date').value;
      const desc = document.getElementById('edit-desc').value.trim();
      const cat = document.getElementById('edit-cat').value;
      const type = document.getElementById('edit-type').value;
      const amount = readNumber(document.getElementById('edit-amount'), NaN);
      if (date && desc && amount > 0) {
        t.date = date;
        t.description = desc;
        t.category = cat;
        t.type = type;
        t.amount = amount;
      }
    }
    ui.editingTxId = null;
    render();
  } else if (action === 'save-budget') {
    const input = document.querySelector(`[data-budget-for="${btn.dataset.category}"]`);
    const amount = readNumber(input, NaN);
    if (Number.isFinite(amount) && amount >= 0) updateBudget(btn.dataset.category, amount);
    render();
  } else if (action === 'add-goal') {
    const input = document.querySelector(`[data-goal-for="${btn.dataset.id}"]`);
    const amount = readNumber(input, NaN);
    if (Number.isFinite(amount) && amount > 0) addToGoal(btn.dataset.id, amount);
    render();
  } else if (action === 'bill-paid') {
    setBillStatus(btn.dataset.id, 'paid');
    render();
  } else if (action === 'bill-unpaid') {
    setBillStatus(btn.dataset.id, 'upcoming');
    render();
  }
});

// Filters and forms, delegated so they survive re-renders.
app.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'tx-search') {
    ui.txSearch = el.value;
    const pos = el.selectionStart;
    render();
    const again = document.getElementById('tx-search');
    if (again) {
      again.focus();
      again.setSelectionRange(pos, pos);
    }
  }
});

app.addEventListener('change', (event) => {
  const el = event.target;
  if (el.id === 'tx-category') ui.txCategory = el.value;
  else if (el.id === 'tx-type') ui.txType = el.value;
  else if (el.id === 'tx-sort') ui.txSort = el.value;
  else if (el.id === 'bill-sort') ui.billSort = el.value;
  else return;
  render();
});

app.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === 'add-tx') {
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    const description = String(data.get('description') || '').trim();
    const date = String(data.get('date') || '');
    if (!date || !description || !Number.isFinite(amount) || amount <= 0) {
      document.getElementById('add-tx-note').textContent = 'Please fill in a date, a description and an amount over $0.';
      return;
    }
    addTransaction({
      date,
      description,
      category: String(data.get('category')),
      type: String(data.get('type')),
      amount,
    });
    document.getElementById('add-tx-note').textContent = `Added “${description}” — ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`;
    render();
  } else if (form.id === 'calc') {
    const data = new FormData(form);
    ui.calcTarget = Number(data.get('target'));
    ui.calcSaved = Number(data.get('saved'));
    ui.calcMonthly = Number(data.get('monthly'));
    ui.calcMonths = Number(data.get('months'));
    ui.calcResult = '';
    render();
  }
});

window.addEventListener('hashchange', render);
render();
