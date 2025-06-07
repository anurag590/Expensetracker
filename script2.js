const budgetInput = document.getElementById("budget");
const setBudgetBtn = document.getElementById("set-budget-btn");
const budgetAmountSpan = document.getElementById("budget-amount");
const remainingSpan = document.getElementById("remaining");

const form = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const expenseList = document.getElementById("expense-list");
const totalSpan = document.getElementById("total");
const ctx = document.getElementById("expenseChart").getContext("2d");

let budget = 0;
let expenses = [];
let chart;

setBudgetBtn.addEventListener("click", () => {
  const val = parseFloat(budgetInput.value);
  if (val >= 0) {
    budget = val;
    budgetAmountSpan.textContent = budget.toFixed(2);
    updateRemaining();
  } else {
    alert("Please enter a valid budget amount");
  }
});

function updateTotal() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalSpan.textContent = total.toFixed(2);
  updateRemaining();
}

function updateRemaining() {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  remainingSpan.textContent = remaining.toFixed(2);
}

function updateList() {
  expenseList.innerHTML = "";
  expenses.forEach((e) => {
    const li = document.createElement("li");
    li.textContent = `${e.category} - ₹${e.amount.toFixed(2)} - ${e.date}`;
    expenseList.appendChild(li);
  });
}

function updateChart() {
  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();
  const date = dateInput.value;

  if (!amount || !category || !date) return;

  expenses.push({ amount, category, date });

  updateTotal();
  updateList();
  updateChart();

  form.reset();
});
