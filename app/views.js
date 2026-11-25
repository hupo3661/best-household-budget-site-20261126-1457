// Page renderers for HomeBudget. Every page is plain HTML built from state.js,
// so the numbers on one page always match the numbers on the others.
// UI state (filters, the row being edited) lives in `ui` and survives re-renders.

import { categoryColors } from './data.js';
import {
  billsDue,
  billsDueTotal,
  billsOverdue,
  goalsTargetTotal,
  goalsTotal,
  history,
  money,
  monthName,
  monthlyNeeded,
  monthsToGoal,
  pct,
  rankedCategories,
  savingsRate,
  state,
  totalBudget,
  totalIncome,
  totalSaved,
  totalSpent,
} from './state.js';
import { barsChart, donutChart } from './charts.js';

export const ui = {
  txSearch: '',
  txCategory: 'all',
  txType: 'all',
  txSort: 'date-desc',
  editingTxId: null,
  billSort: 'due',
  calcTarget: 5000,
  calcSaved: 1275,
  calcMonthly: 200,
  calcMonths: 12,
  calcResult: '',
};

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function kpi(label, value, sub) {
  return `<div class="kpi"><span class="kpi-label">${label}</span><span class="kpi-value">${value}</span><span class="kpi-sub">${sub}</span></div>`;
}

function bar(percent, cls) {
  const p = Math.max(0, Math.min(100, percent));
  return `<div class="progress"><div class="progress-fill ${cls || ''}" style="width:${p.toFixed(1)}%"></div></div>`;
}

function navCards() {
  const cards = [
    ['#/transactions', 'Transactions', 'Add, edit and search every dollar in and out.'],
    ['#/budgets', 'Budgets', 'A monthly limit for each category, with live progress.'],
    ['#/savings', 'Savings', 'Goals, progress and a calculator that plans the way there.'],
    ['#/bills', 'Bills', 'What is due, what is overdue, and what is already paid.'],
    ['#/reports', 'Reports', 'Six months of income and spending, side by side.'],
  ];
  return `<section class="card-grid">${cards.map(([href, t, d]) => `<a class="nav-card" href="${href}"><strong>${t}</strong><span>${d}</span></a>`).join('')}</section>`;
}

// ---------- Dashboard ----------

export function dashboard() {
  const spent = totalSpent();
  const income = totalIncome();
  const saved = totalSaved();
  const ranked = rankedCategories();
  const top = ranked.slice(0, 5);
  const slices = ranked.slice(0, 6).map((c) => ({ label: c.category, value: c.spent, color: categoryColors[c.category] }));
  const other = ranked.slice(6).reduce((s, c) => s + c.spent, 0);
  if (other > 0) slices.push({ label: 'Other', value: other, color: '#c9c2b8' });
  const upcoming = billsDue().sort((a, b) => a.due.localeCompare(b.due)).slice(0, 3);
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 5);
  const lastMonth = history().find((r) => r.month === 'Oct 2026');
  const monthDelta = lastMonth ? saved - (lastMonth.income - lastMonth.spent) : 0;
  return `
  <section class="page-head"><h1>November 2026 at a glance</h1>
  <p>The Example Household — two adults, two children, one shared budget. Every figure below comes from the same ledger, so the totals always add up.</p></section>
  <section class="kpi-row">
    ${kpi('Income', money(income), '4 sources, all received')}
    ${kpi('Spent', money(spent), '45 transactions so far')}
    ${kpi('Saved', money(saved), 'kept for goals and the future')}
    ${kpi('Savings rate', pct(savingsRate()), 'of income saved this month')}
  </section>
  <p class="month-compare">${monthDelta >= 0 ? `▲ ${money(monthDelta)} more saved than in October` : `▼ ${money(-monthDelta)} less saved than in October`} (${money(lastMonth.spent)} spent in October vs ${money(spent)} in November).</p>
  <section class="two-col">
    <div class="panel"><h2>Where the money went</h2>${donutChart(slices)}
      <ul class="top-list">${top.map((c) => `<li><span>${c.category}</span><span>${money(c.spent)} of ${money(c.budget)}</span>${bar((c.spent / c.budget) * 100, c.spent > c.budget ? 'over' : '')}</li>`).join('')}</ul>
      <p><a href="#/budgets">See all twelve budgets →</a></p></div>
    <div class="panel"><h2>Income vs spending — last 6 months</h2>${barsChart(history())}
      <p>November is the best saving month so far: ${money(saved)} kept out of ${money(income)}.</p>
      <h2>Coming up</h2>
      <ul class="bill-mini">${upcoming.map((b) => `<li><span>${esc(b.name)}</span><span>${money(b.amount)} · due ${monthName(b.due)}</span></li>`).join('')}</ul>
      <p><a href="#/bills">All bills, including ${billsOverdue().length} overdue →</a></p></div>
  </section>
  <section class="panel"><h2>Latest transactions</h2>
    <table class="tx-table"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th></tr></thead><tbody>
    ${recent.map((t) => `<tr><td>${monthName(t.date)}</td><td>${esc(t.description)}</td><td>${esc(t.category)}</td><td class="num ${t.type}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td></tr>`).join('')}
    </tbody></table>
    <p><a href="#/transactions">Open the full ledger →</a></p></section>
  ${navCards()}`;
}

// ---------- Transactions ----------

function txRow(t) {
  if (ui.editingTxId === t.id) {
    return `<tr class="editing"><td><input type="date" id="edit-date" value="${t.date}"></td>
    <td><input type="text" id="edit-desc" value="${esc(t.description)}"></td>
    <td><select id="edit-cat">${state.budgets.map((b) => `<option ${b.category === t.category ? 'selected' : ''}>${b.category}</option>`).join('')}<option ${t.category === 'Income' ? 'selected' : ''}>Income</option></select></td>
    <td><select id="edit-type"><option value="expense" ${t.type === 'expense' ? 'selected' : ''}>Expense</option><option value="income" ${t.type === 'income' ? 'selected' : ''}>Income</option></select></td>
    <td class="num"><input type="number" id="edit-amount" min="0" step="0.01" value="${t.amount.toFixed(2)}"></td>
    <td class="actions"><button class="btn small" data-action="save-edit" data-id="${t.id}">Save</button> <button class="btn small ghost" data-action="cancel-edit">Cancel</button></td></tr>`;
  }
  return `<tr><td>${monthName(t.date)}</td><td>${esc(t.description)}</td><td>${esc(t.category)}</td>
  <td><span class="badge ${t.type}">${t.type}</span></td>
  <td class="num ${t.type}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td>
  <td class="actions"><button class="btn small ghost" data-action="edit-tx" data-id="${t.id}">Edit</button> <button class="btn small danger" data-action="delete-tx" data-id="${t.id}">Delete</button></td></tr>`;
}

export function transactionsPage() {
  let rows = [...state.transactions];
  if (ui.txCategory !== 'all') rows = rows.filter((t) => t.category === ui.txCategory);
  if (ui.txType !== 'all') rows = rows.filter((t) => t.type === ui.txType);
  if (ui.txSearch.trim()) {
    const q = ui.txSearch.trim().toLowerCase();
    rows = rows.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  const sorts = {
    'date-desc': (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
    'date-asc': (a, b) => a.date.localeCompare(b.date) || a.id - b.id,
    'amount-desc': (a, b) => b.amount - a.amount,
    'amount-asc': (a, b) => a.amount - b.amount,
  };
  rows.sort(sorts[ui.txSort]);
  const exp = rows.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const inc = rows.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const cats = ['all', ...state.budgets.map((b) => b.category), 'Income'];
  return `
  <section class="page-head"><h1>Transactions</h1>
  <p>Every dollar in and out this month. Add a new one, edit a mistake, delete a duplicate — the dashboard, budgets and reports update at once.</p></section>
  <section class="panel"><h2>Add a transaction</h2>
  <form id="add-tx" class="form-grid">
    <label>Date <input type="date" name="date" value="2026-11-25" required></label>
    <label>Description <input type="text" name="description" placeholder="e.g. Weekly grocery shop" required></label>
    <label>Category <select name="category">${state.budgets.map((b) => `<option>${b.category}</option>`).join('')}<option>Income</option></select></label>
    <label>Type <select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label>
    <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
    <span class="form-actions"><button class="btn" type="submit">Add transaction</button></span>
  </form><p class="form-note" id="add-tx-note"></p></section>
  <section class="panel"><h2>The ledger</h2>
  <div class="filters">
    <label>Search <input type="search" id="tx-search" placeholder="Search description…" value="${esc(ui.txSearch)}"></label>
    <label>Category <select id="tx-category">${cats.map((c) => `<option value="${c}" ${ui.txCategory === c ? 'selected' : ''}>${c === 'all' ? 'All categories' : c}</option>`).join('')}</select></label>
    <label>Type <select id="tx-type"><option value="all" ${ui.txType === 'all' ? 'selected' : ''}>All types</option><option value="expense" ${ui.txType === 'expense' ? 'selected' : ''}>Expenses</option><option value="income" ${ui.txType === 'income' ? 'selected' : ''}>Income</option></select></label>
    <label>Sort <select id="tx-sort">
      <option value="date-desc" ${ui.txSort === 'date-desc' ? 'selected' : ''}>Newest first</option>
      <option value="date-asc" ${ui.txSort === 'date-asc' ? 'selected' : ''}>Oldest first</option>
      <option value="amount-desc" ${ui.txSort === 'amount-desc' ? 'selected' : ''}>Largest amount first</option>
      <option value="amount-asc" ${ui.txSort === 'amount-asc' ? 'selected' : ''}>Smallest amount first</option>
    </select></label>
  </div>
  <p class="summary-line">Showing ${rows.length} of ${state.transactions.length} transactions · Expenses ${money(exp)} · Income ${money(inc)}</p>
  <table class="tx-table"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th class="num">Amount</th><th>Actions</th></tr></thead>
  <tbody>${rows.length ? rows.map(txRow).join('') : '<tr><td colspan="6">No transactions match these filters. Try clearing the search.</td></tr>'}</tbody></table></section>`;
}

// ---------- Budgets ----------

export function budgetsPage() {
  const spent = totalSpent();
  const budget = totalBudget();
  const ranked = rankedCategories();
  return `
  <section class="page-head"><h1>Budgets</h1>
  <p>A monthly limit for each category. The bars fill as spending is recorded, so you can see at a glance what is left before the month ends.</p></section>
  <section class="kpi-row">
    ${kpi('Total budget', money(budget), 'for all 12 categories')}
    ${kpi('Spent so far', money(spent), pct(spent / budget) + ' of the budget used')}
    ${kpi('Left to spend', money(budget - spent), 'across the month')}
  </section>
  <section class="panel"><h2>This month's budget</h2>${bar((spent / budget) * 100)}
  <p>${money(spent)} of ${money(budget)} used — ${money(budget - spent)} still available with 5 days left in November.</p></section>
  <section class="budget-grid">
  ${ranked.map((c) => {
    const used = (c.spent / c.budget) * 100;
    const cls = used > 100 ? 'over' : used >= 80 ? 'warm' : '';
    const status = used > 100 ? 'Over budget' : used >= 80 ? 'Nearly used up' : used >= 50 ? 'On track' : 'Plenty left';
    return `<article class="budget-card"><h3>${c.category}</h3><p class="budget-nums">${money(c.spent)} <span>of ${money(c.budget)}</span></p>
    ${bar(used, cls)}
    <p class="budget-status ${cls}">${status} — ${money(Math.abs(c.left))} ${c.left >= 0 ? 'left' : 'over'}</p>
    <p class="muted">${esc(c.note)}</p>
    <label class="budget-edit">Monthly limit ($) <input type="number" min="0" step="1" value="${c.budget}" data-budget-for="${c.category}"> <button class="btn small" data-action="save-budget" data-category="${c.category}">Update</button></label>
    </article>`;
  }).join('')}
  </section>
  <section class="panel"><h2>How the limits were set</h2>
  <p>Each limit comes from the last three months of real spending, rounded to a round number and trimmed by 5% where the household wanted to save. Housing is fixed by the lease; groceries are the biggest flexible cost, so they get the closest watch. Change any limit above and every total on the site follows.</p></section>`;
}

// ---------- Savings ----------

function goalCard(g) {
  const used = (g.saved / g.target) * 100;
  return `<article class="goal-card"><h3>${esc(g.name)}</h3>
  <p class="budget-nums">${money(g.saved)} <span>of ${money(g.target)}</span></p>
  ${bar(used)}
  <p class="budget-status">${pct(g.saved / g.target)} saved — ${money(g.target - g.saved)} to go</p>
  <p class="muted">${esc(g.note)}</p>
  <label class="budget-edit">Add to this goal ($) <input type="number" min="1" step="1" value="100" data-goal-for="${g.id}"> <button class="btn small" data-action="add-goal" data-id="${g.id}">Add money</button></label>
  </article>`;
}

export function savingsPage() {
  const total = goalsTotal();
  const target = goalsTargetTotal();
  const monthlySave = totalSaved();
  const months = monthsToGoal(ui.calcTarget, ui.calcSaved, ui.calcMonthly);
  const needed = monthlyNeeded(ui.calcTarget, ui.calcSaved, ui.calcMonths);
  let result = ui.calcResult;
  if (!result && months !== null) {
    result = months === 0
      ? 'Goal already reached.'
      : `At ${money(ui.calcMonthly)} a month, the goal is reached in ${months} month${months === 1 ? '' : 's'} — around ${new Date(2026, 10 + months, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;
  }
  return `
  <section class="page-head"><h1>Savings goals</h1>
  <p>${money(total)} saved across ${state.goals.length} goals, out of ${money(target)} planned (${pct(total / target)}). This month's surplus of ${money(monthlySave)} is split between them at the end of the month.</p></section>
  <section class="kpi-row">
    ${kpi('Saved so far', money(total), 'across all goals')}
    ${kpi('Still to save', money(target - total), 'to reach every goal')}
    ${kpi('This month’s surplus', money(monthlySave), 'available to put towards goals')}
  </section>
  <section class="goal-grid">${state.goals.map(goalCard).join('')}</section>
  <section class="panel"><h2>Savings calculator</h2>
  <p>Work out how long a goal takes — or how much a month it needs.</p>
  <form id="calc" class="form-grid">
    <label>Goal amount ($) <input type="number" name="target" min="1" step="1" value="${ui.calcTarget}" required></label>
    <label>Already saved ($) <input type="number" name="saved" min="0" step="1" value="${ui.calcSaved}" required></label>
    <label>Monthly contribution ($) <input type="number" name="monthly" min="1" step="1" value="${ui.calcMonthly}" required></label>
    <label>Or: reach it in (months) <input type="number" name="months" min="1" step="1" value="${ui.calcMonths}" required></label>
    <span class="form-actions"><button class="btn" type="submit">Calculate</button></span>
  </form>
  <p class="calc-result" id="calc-result">${esc(result)}</p>
  <p class="muted">${needed !== null ? `To reach ${money(ui.calcTarget)} in ${ui.calcMonths} months from ${money(ui.calcSaved)} saved, put aside ${money(needed)} a month.` : ''}</p>
  </section>
  <section class="panel"><h2>A simple rule that works</h2>
  <p>Pay the goals first: on payday, move the month's surplus straight into the emergency fund until it is full, then split the rest between the other goals. A goal with a date and a monthly amount is a plan; a goal without them is a wish.</p></section>`;
}

// ---------- Bills ----------

export function billsPage() {
  const due = billsDue();
  const overdue = billsOverdue();
  const paid = state.bills.filter((b) => b.status === 'paid');
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const sorts = {
    due: (a, b) => a.due.localeCompare(b.due),
    amount: (a, b) => b.amount - a.amount,
  };
  const rows = [...state.bills].sort(sorts[ui.billSort]);
  return `
  <section class="page-head"><h1>Bills</h1>
  <p>Everything the household owes, when it is due, and whether it is paid. Mark a bill paid and the totals update — nothing slips through.</p></section>
  <section class="kpi-row">
    ${kpi('Still to pay', money(billsDueTotal()), due.length + ' bills outstanding')}
    ${kpi('Overdue', money(overdue.reduce((s, b) => s + b.amount, 0)), overdue.length + (overdue.length === 1 ? ' bill needs attention' : ' bills need attention'))}
    ${kpi('Already paid', money(paidTotal), paid.length + ' bills paid this month')}
  </section>
  ${overdue.length ? `<section class="alert"><strong>Heads up:</strong> ${overdue.map((b) => `${esc(b.name)} ${money(b.amount)} was due ${monthName(b.due)}`).join('; ')}. Update the payment method or pay it now to avoid a late fee.</section>` : ''}
  <section class="panel"><h2>All bills</h2>
  <div class="filters"><label>Sort <select id="bill-sort">
    <option value="due" ${ui.billSort === 'due' ? 'selected' : ''}>Due date — soonest first</option>
    <option value="amount" ${ui.billSort === 'amount' ? 'selected' : ''}>Largest amount first</option>
  </select></label></div>
  <table class="tx-table"><thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>Status</th><th>Note</th><th>Action</th></tr></thead><tbody>
  ${rows.map((b) => `<tr class="${b.status}"><td>${esc(b.name)}</td><td>${monthName(b.due)}, 2026</td><td class="num">${money(b.amount)}</td>
  <td><span class="badge ${b.status}">${b.status}</span></td><td class="muted">${esc(b.note)}</td>
  <td class="actions">${b.status === 'paid' ? `<button class="btn small ghost" data-action="bill-unpaid" data-id="${b.id}">Mark unpaid</button>` : `<button class="btn small" data-action="bill-paid" data-id="${b.id}">Mark paid</button>`}</td></tr>`).join('')}
  </tbody></table></section>`;
}

// ---------- Reports ----------

export function reportsPage() {
  const hist = history();
  const avgSpent = hist.reduce((s, r) => s + r.spent, 0) / hist.length;
  const best = [...hist].sort((a, b) => (a.income - a.spent) - (b.income - b.spent)).pop();
  const ranked = rankedCategories();
  const spent = totalSpent();
  const biggest = ranked[0];
  return `
  <section class="page-head"><h1>Reports</h1>
  <p>Six months of household money, side by side. The patterns are easy to spot: August cost the most, September saved the most, and November is on track to be the cheapest month since June.</p></section>
  <section class="panel"><h2>Income vs spending — June to November 2026</h2>${barsChart(hist)}
  <table class="tx-table"><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Saved</th><th class="num">Savings rate</th></tr></thead><tbody>
  ${hist.map((r) => `<tr><td>${r.month}</td><td class="num">${money(r.income)}</td><td class="num">${money(r.spent)}</td><td class="num income">${money(r.income - r.spent)}</td><td class="num">${pct((r.income - r.spent) / r.income)}</td></tr>`).join('')}
  </tbody></table></section>
  <section class="panel"><h2>November spending by category</h2>
  <table class="tx-table"><thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th><th class="num">Budget</th><th class="num">Left</th></tr></thead><tbody>
  ${ranked.map((c) => `<tr><td><span class="dot" style="background:${categoryColors[c.category]}"></span> ${c.category}</td><td class="num">${money(c.spent)}</td><td class="num">${pct(c.spent / spent)}</td><td class="num">${money(c.budget)}</td><td class="num ${c.left < 0 ? 'expense' : 'income'}">${money(c.left)}</td></tr>`).join('')}
  </tbody></table></section>
  <section class="panel"><h2>What the numbers say</h2><ul class="insights">
  <li><strong>${biggest.category}</strong> is the biggest cost at ${money(biggest.spent)} — ${pct(biggest.spent / spent)} of all spending — and it is fixed by the lease, so savings have to come from elsewhere.</li>
  <li><strong>${best.month}</strong> was the best saving month: ${money(best.income - best.spent)} kept, a ${pct((best.income - best.spent) / best.income)} savings rate.</li>
  <li>Average monthly spending over six months is ${money(avgSpent)}. November's ${money(spent)} is ${money(avgSpent - spent)} below that average.</li>
  <li>Groceries, dining out and entertainment together cost ${money(ranked.find((c) => c.category === 'Groceries').spent + ranked.find((c) => c.category === 'Dining out').spent + ranked.find((c) => c.category === 'Entertainment').spent)} — the food and fun budget is where one home-cooked meal a week saves the most.</li>
  <li>Every category is within budget this month. The tightest is Housing at ${pct(ranked.find((c) => c.category === 'Housing').spent / ranked.find((c) => c.category === 'Housing').budget)} used, which is expected: rent is paid in full on the 1st.</li>
  </ul></section>`;
}

export function missing() {
  return `<section class="page-head"><h1>Page not found</h1><p>That section does not exist. <a href="#/">Back to the dashboard →</a></p></section>`;
}
