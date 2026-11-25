// Sample data for the Example Household, November 2026. Every figure on the
// site is derived from these tables, so income, spending, budgets, savings
// and bills always agree with each other. Amounts are US dollars.

export const MONTH = 'November 2026';

// Monthly income, by source.
export const incomeSources = [
  { source: 'Salary — first earner', amount: 4200.0, day: 1 },
  { source: 'Salary — second earner', amount: 2300.0, day: 1 },
  { source: 'Weekend freelance work', amount: 250.0, day: 14 },
  { source: 'Savings interest', amount: 100.0, day: 20 },
];

// Monthly budget per spending category.
export const budgets = [
  { category: 'Housing', budget: 1850.0, note: 'Rent, paid on the 1st' },
  { category: 'Groceries', budget: 720.0, note: 'Weekly shop, about $170 a week' },
  { category: 'Dining out', budget: 240.0, note: 'One family meal out a week' },
  { category: 'Transport', budget: 380.0, note: 'Fuel, transit pass and parking' },
  { category: 'Utilities', budget: 260.0, note: 'Electricity, water, gas, internet' },
  { category: 'Entertainment', budget: 150.0, note: 'Cinema, games and streaming' },
  { category: 'Clothing', budget: 120.0, note: 'Growing kids, one item a month' },
  { category: 'Health', budget: 200.0, note: 'Pharmacy and check-ups' },
  { category: 'Kids & school', budget: 300.0, note: 'Lunches, clubs and supplies' },
  { category: 'Subscriptions', budget: 85.0, note: 'Music, video, cloud and apps' },
  { category: 'Personal', budget: 160.0, note: 'Haircuts, toiletries and gifts' },
  { category: 'Home', budget: 140.0, note: 'Small repairs and household items' },
];

// Every transaction of the month. Expense rows sum, per category, to the
// spent column the Budgets page shows; income rows sum to $6,850.
export const transactions = [
  { id: 1, date: '2026-11-01', description: 'Monthly rent', category: 'Housing', type: 'expense', amount: 1850.0 },
  { id: 2, date: '2026-11-01', description: 'Salary — first earner', category: 'Income', type: 'income', amount: 4200.0 },
  { id: 3, date: '2026-11-01', description: 'Salary — second earner', category: 'Income', type: 'income', amount: 2300.0 },
  { id: 4, date: '2026-11-01', description: 'Music streaming', category: 'Subscriptions', type: 'expense', amount: 10.99 },
  { id: 5, date: '2026-11-01', description: 'Cloud storage', category: 'Subscriptions', type: 'expense', amount: 9.99 },
  { id: 6, date: '2026-11-02', description: 'Fuel — family car', category: 'Transport', type: 'expense', amount: 58.3 },
  { id: 7, date: '2026-11-03', description: 'Weekly grocery shop', category: 'Groceries', type: 'expense', amount: 148.2 },
  { id: 8, date: '2026-11-04', description: 'Pharmacy — cold medicine', category: 'Health', type: 'expense', amount: 24.6 },
  { id: 9, date: '2026-11-05', description: 'School lunches — two weeks', category: 'Kids & school', type: 'expense', amount: 85.0 },
  { id: 10, date: '2026-11-05', description: 'Pizza night', category: 'Dining out', type: 'expense', amount: 46.2 },
  { id: 11, date: '2026-11-06', description: 'Electricity bill', category: 'Utilities', type: 'expense', amount: 96.4 },
  { id: 12, date: '2026-11-07', description: 'Cinema — family film', category: 'Entertainment', type: 'expense', amount: 32.0 },
  { id: 13, date: '2026-11-08', description: 'Weekly grocery shop', category: 'Groceries', type: 'expense', amount: 132.45 },
  { id: 14, date: '2026-11-08', description: 'Video streaming', category: 'Subscriptions', type: 'expense', amount: 14.99 },
  { id: 15, date: '2026-11-09', description: 'Fuel — family car', category: 'Transport', type: 'expense', amount: 61.1 },
  { id: 16, date: '2026-11-09', description: 'Haircut', category: 'Personal', type: 'expense', amount: 35.0 },
  { id: 17, date: '2026-11-10', description: 'Water bill', category: 'Utilities', type: 'expense', amount: 38.25 },
  { id: 18, date: '2026-11-10', description: 'Light bulbs and tools', category: 'Home', type: 'expense', amount: 42.45 },
  { id: 19, date: '2026-11-11', description: 'Kids’ winter shoes', category: 'Clothing', type: 'expense', amount: 58.99 },
  { id: 20, date: '2026-11-12', description: 'After-school club — term fee', category: 'Kids & school', type: 'expense', amount: 96.0 },
  { id: 21, date: '2026-11-12', description: 'Lunch at the café', category: 'Dining out', type: 'expense', amount: 28.45 },
  { id: 22, date: '2026-11-13', description: 'Internet — monthly', category: 'Utilities', type: 'expense', amount: 59.0 },
  { id: 23, date: '2026-11-14', description: 'Weekly grocery shop', category: 'Groceries', type: 'expense', amount: 156.8 },
  { id: 24, date: '2026-11-14', description: 'Weekend freelance work', category: 'Income', type: 'income', amount: 250.0 },
  { id: 25, date: '2026-11-14', description: 'Film rental — movie night', category: 'Entertainment', type: 'expense', amount: 18.75 },
  { id: 26, date: '2026-11-15', description: 'Monthly transit pass', category: 'Transport', type: 'expense', amount: 48.0 },
  { id: 27, date: '2026-11-15', description: 'Online news subscription', category: 'Subscriptions', type: 'expense', amount: 12.0 },
  { id: 28, date: '2026-11-16', description: 'Takeaway dinner', category: 'Dining out', type: 'expense', amount: 52.8 },
  { id: 29, date: '2026-11-16', description: 'Toiletries', category: 'Personal', type: 'expense', amount: 28.6 },
  { id: 30, date: '2026-11-17', description: 'Gas bill', category: 'Utilities', type: 'expense', amount: 49.53 },
  { id: 31, date: '2026-11-18', description: 'School supplies', category: 'Kids & school', type: 'expense', amount: 83.1 },
  { id: 32, date: '2026-11-18', description: 'Fuel — family car', category: 'Transport', type: 'expense', amount: 55.0 },
  { id: 33, date: '2026-11-19', description: 'Weekly grocery shop', category: 'Groceries', type: 'expense', amount: 121.3 },
  { id: 34, date: '2026-11-19', description: 'Dentist check-up', category: 'Health', type: 'expense', amount: 117.7 },
  { id: 35, date: '2026-11-20', description: 'Savings interest', category: 'Income', type: 'income', amount: 100.0 },
  { id: 36, date: '2026-11-20', description: 'Board game for family night', category: 'Entertainment', type: 'expense', amount: 46.0 },
  { id: 37, date: '2026-11-21', description: 'Family restaurant dinner', category: 'Dining out', type: 'expense', amount: 60.05 },
  { id: 38, date: '2026-11-21', description: 'Plant pots and soil', category: 'Home', type: 'expense', amount: 50.0 },
  { id: 39, date: '2026-11-22', description: 'Corner shop top-up', category: 'Groceries', type: 'expense', amount: 42.15 },
  { id: 40, date: '2026-11-22', description: 'Fitness app — monthly', category: 'Subscriptions', type: 'expense', amount: 19.99 },
  { id: 41, date: '2026-11-23', description: 'City centre parking', category: 'Transport', type: 'expense', amount: 22.0 },
  { id: 42, date: '2026-11-24', description: 'Fuel — family car', category: 'Transport', type: 'expense', amount: 68.0 },
  { id: 43, date: '2026-11-24', description: 'Birthday gift for a relative', category: 'Personal', type: 'expense', amount: 55.0 },
  { id: 44, date: '2026-11-25', description: 'Weekly grocery shop', category: 'Groceries', type: 'expense', amount: 83.42 },
  { id: 45, date: '2026-11-25', description: 'Audiobooks subscription', category: 'Subscriptions', type: 'expense', amount: 14.98 },
];

// Savings goals.
export const savingsGoals = [
  { id: 'emergency', name: 'Emergency fund', target: 12000.0, saved: 9450.0, note: 'Six months of essential spending, kept in a separate account.' },
  { id: 'holiday', name: 'Family holiday', target: 3500.0, saved: 2180.0, note: 'A week by the sea next summer, flights and stay included.' },
  { id: 'car', name: 'Next family car', target: 8000.0, saved: 3150.0, note: 'Replacing the old car in about two years.' },
  { id: 'renovation', name: 'Kitchen refresh', target: 5000.0, saved: 1275.0, note: 'New worktops and paint, planned for next autumn.' },
];

// Bills: what is due, when, and whether it is already paid. "Today" for the
// site is 25 November 2026, so anything due before that and unpaid is overdue.
export const bills = [
  { id: 'b1', name: 'Monthly rent', amount: 1850.0, due: '2026-12-01', status: 'upcoming', note: 'Paid by standing order on the 1st.' },
  { id: 'b2', name: 'Electricity', amount: 96.4, due: '2026-11-28', status: 'upcoming', note: 'Direct debit, meter read on the 25th.' },
  { id: 'b3', name: 'Gym membership', amount: 29.0, due: '2026-11-24', status: 'overdue', note: 'Card expired — update the payment method.' },
  { id: 'b4', name: 'Internet', amount: 59.0, due: '2026-12-05', status: 'upcoming', note: 'Fixed monthly price until March.' },
  { id: 'b5', name: 'Water', amount: 38.25, due: '2026-12-08', status: 'upcoming', note: 'Quarterly metered bill.' },
  { id: 'b6', name: 'Home insurance', amount: 142.0, due: '2026-12-10', status: 'upcoming', note: 'Annual premium, second instalment.' },
  { id: 'b7', name: 'Mobile phones — two lines', amount: 64.0, due: '2026-12-12', status: 'upcoming', note: 'Shared family plan.' },
  { id: 'b8', name: 'Music streaming', amount: 10.99, due: '2026-12-01', status: 'upcoming', note: 'Family plan, renews monthly.' },
  { id: 'b9', name: 'Internet', amount: 59.0, due: '2026-11-13', status: 'paid', note: 'Paid on time by direct debit.' },
  { id: 'b10', name: 'Electricity', amount: 96.4, due: '2026-11-06', status: 'paid', note: 'Paid on time by direct debit.' },
];

// Income and spending for the last six months, for the Reports chart.
export const monthlyHistory = [
  { month: 'Jun 2026', income: 6850.0, spent: 4201.1 },
  { month: 'Jul 2026', income: 6850.0, spent: 4487.65 },
  { month: 'Aug 2026', income: 7100.0, spent: 4732.8 },
  { month: 'Sep 2026', income: 6850.0, spent: 3988.25 },
  { month: 'Oct 2026', income: 6850.0, spent: 4276.4 },
  { month: 'Nov 2026', income: 6850.0, spent: 4133.53 },
];

// Colours for the spending categories, used by the donut chart and bars.
export const categoryColors = {
  Housing: '#2f6f5e',
  Groceries: '#4c9a6c',
  'Dining out': '#e0a458',
  Transport: '#5b7fa6',
  Utilities: '#7a6fb0',
  Entertainment: '#d97b9c',
  Clothing: '#8a6d4b',
  Health: '#3fa7a0',
  'Kids & school': '#c96f4a',
  Subscriptions: '#6b7c93',
  Personal: '#a3b86b',
  Home: '#b08968',
};
