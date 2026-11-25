// State and arithmetic for HomeBudget. Everything shown on the site is
// computed here from data.js, so no figure can disagree with another:
// totals come from the transactions, category spending from the same rows,
// and the savings rate from income minus spending.

import { budgets, bills, incomeSources, monthlyHistory, savingsGoals, transactions } from './data.js';

// Working copies, so edits in the browser change the live figures.
export const state = {
  transactions: transactions.map((t) => ({ ...t })),
  budgets: budgets.map((b) => ({ ...b })),
  goals: savingsGoals.map((g) => ({ ...g })),
  bills: bills.map((b) => ({ ...b })),
  nextTxId: Math.max(...transactions.map((t) => t.id)) + 1,
};

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function pct(n) {
  return (n * 100).toFixed(1) + '%';
}

export function totalIncome() {
  return state.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
}

export function totalSpent() {
  return state.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
}

export function totalSaved() {
  return totalIncome() - totalSpent();
}

export function savingsRate() {
  const income = totalIncome();
  return income > 0 ? totalSaved() / income : 0;
}

export function totalBudget() {
  return state.budgets.reduce((s, b) => s + b.budget, 0);
}

// Spent per category, from the transaction rows.
export function spentByCategory() {
  const out = {};
  for (const b of state.budgets) out[b.category] = 0;
  for (const t of state.transactions) {
    if (t.type === 'expense' && t.category in out) out[t.category] += t.amount;
  }
  return out;
}

// Categories sorted by spending, biggest first.
export function rankedCategories() {
  const spent = spentByCategory();
  return state.budgets
    .map((b) => ({ ...b, spent: spent[b.category], left: b.budget - spent[b.category] }))
    .sort((a, b) => b.spent - a.spent);
}

export function incomeTotal() {
  return incomeSources.reduce((s, x) => s + x.amount, 0);
}

export function goalsTotal() {
  return state.goals.reduce((s, g) => s + g.saved, 0);
}

export function goalsTargetTotal() {
  return state.goals.reduce((s, g) => s + g.target, 0);
}

export function billsDue() {
  return state.bills.filter((b) => b.status !== 'paid');
}

export function billsOverdue() {
  return state.bills.filter((b) => b.status === 'overdue');
}

export function billsDueTotal() {
  return billsDue().reduce((s, b) => s + b.amount, 0);
}

export function history() {
  return monthlyHistory;
}

// --- Mutations: every tool on the site writes through these. ---

export function addTransaction({ date, description, category, type, amount }) {
  const tx = { id: state.nextTxId++, date, description, category, type, amount };
  state.transactions.push(tx);
  return tx;
}

export function deleteTransaction(id) {
  const i = state.transactions.findIndex((t) => t.id === id);
  if (i >= 0) state.transactions.splice(i, 1);
}

export function updateBudget(category, amount) {
  const b = state.budgets.find((x) => x.category === category);
  if (b && Number.isFinite(amount) && amount >= 0) b.budget = amount;
}

export function addToGoal(id, amount) {
  const g = state.goals.find((x) => x.id === id);
  if (g && Number.isFinite(amount) && amount > 0) g.saved = Math.min(g.target, g.saved + amount);
}

export function setBillStatus(id, status) {
  const b = state.bills.find((x) => x.id === id);
  if (b) b.status = status;
}

// Savings calculator: months to reach a goal at a monthly contribution.
export function monthsToGoal(target, saved, monthly) {
  if (monthly <= 0) return null;
  const left = target - saved;
  if (left <= 0) return 0;
  return Math.ceil(left / monthly);
}

// Monthly contribution needed to reach a goal by a given number of months.
export function monthlyNeeded(target, saved, months) {
  if (months <= 0) return null;
  const left = target - saved;
  if (left <= 0) return 0;
  return left / months;
}

export function monthName(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
