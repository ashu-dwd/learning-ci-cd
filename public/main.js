const API_URL = "/todos";
const AUTH_URL = "/auth";

let currentUser = null;
let productivityChart = null;

function setDarkMode(enabled) {
  document.body.classList.toggle("dark", enabled);
  localStorage.setItem("darkMode", enabled ? "1" : "0");
  document.getElementById("toggle-dark").textContent = enabled ? "☀️" : "🌙";
}

function initDarkMode() {
  const dark = localStorage.getItem("darkMode") === "1";
  setDarkMode(dark);
  document.getElementById("toggle-dark").addEventListener("click", () => {
    setDarkMode(!document.body.classList.contains("dark"));
  });
}

function showInstructionsFirstTime() {
  const instructions = document.querySelector(".instructions");
  if (!localStorage.getItem("seenInstructions")) {
    instructions.style.display = "block";
    instructions.classList.add("highlight-instructions");
    setTimeout(() => {
      instructions.classList.remove("highlight-instructions");
    }, 2000);
    localStorage.setItem("seenInstructions", "1");
  } else {
    instructions.style.display = "";
  }
}

function scheduleNotification(todo) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!todo.due) return;

  const dueDate = new Date(todo.due);
  const now = new Date();
  const msUntilDue = dueDate - now;
  if (msUntilDue > 0 && msUntilDue < 7 * 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      new Notification("Todo Reminder", {
        body: `Task "${todo.title}" is due today!`,
      });
    }, msUntilDue);
  }
}

function handleRecurringSelect() {
  const recurring = document.getElementById("todo-recurring");
  const custom = document.getElementById("todo-recurring-custom");
  recurring.addEventListener("change", () => {
    if (recurring.value === "custom") {
      custom.style.display = "";
      custom.required = true;
    } else {
      custom.style.display = "none";
      custom.required = false;
    }
  });
}

function updateProgressStats(todos) {
  const stats = document.getElementById("progress-stats");
  if (!stats) return;
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // Streak: count consecutive days with at least one completed todo
  let streak = 0;
  let today = new Date();
  let dayMs = 24 * 60 * 60 * 1000;
  let dateSet = new Set(
    todos.filter((t) => t.completed && t.due).map((t) => t.due)
  );
  while (dateSet.has(today.toISOString().slice(0, 10))) {
    streak++;
    today = new Date(today.getTime() - dayMs);
  }

  stats.innerHTML = `
    <strong>Progress:</strong> ${completed} / ${total} completed (${percent}%)
    <span style="margin-left:1em;"><strong>Streak:</strong> ${streak} day${
    streak === 1 ? "" : "s"
  }</span>
  `;
}

function updateProductivityChart(todos) {
  const ctx = document.getElementById("productivity-chart").getContext("2d");
  // Group todos by due date, count completed per day for last 7 days
  const days = [];
  const completedCounts = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().slice(0, 10);
    days.push(dateStr);
    completedCounts.push(
      todos.filter((t) => t.completed && t.due === dateStr).length
    );
  }
  if (productivityChart) {
    productivityChart.data.labels = days;
    productivityChart.data.datasets[0].data = completedCounts;
    productivityChart.update();
  } else {
    productivityChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: days,
        datasets: [
          {
            label: "Completed Todos",
            data: completedCounts,
            backgroundColor: "#27ae60",
            borderRadius: 6,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: getComputedStyle(document.body).color },
          },
          y: {
            beginAtZero: true,
            grid: { color: "#eee" },
            ticks: { color: getComputedStyle(document.body).color },
            suggestedMax: 5,
          },
        },
        responsive: false,
        animation: false,
      },
    });
  }
}

async function fetchTodos() {
  const res = await fetch(API_URL, { credentials: "include" });
  const todos = await res.json();
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  const template = document.getElementById("todo-item-template");
  todos.forEach((todo) => {
    const li = template
      ? template.content.cloneNode(true).querySelector("li")
      : document.createElement("li");

    // Set title, priority, due date, recurring
    if (li.querySelector) {
      li.querySelector(".todo-title").textContent = todo.title;
      const prio = li.querySelector(".todo-priority");
      prio.textContent = ` [${capitalize(todo.priority || "medium")}]`;
      prio.setAttribute(
        "data-priority",
        (todo.priority || "medium").toLowerCase()
      );
      const due = li.querySelector(".todo-due");
      due.textContent = todo.due ? `Due: ${todo.due}` : "";
      const recur = li.querySelector(".todo-recurring");
      if (todo.recurring) {
        if (todo.recurring === "custom" && todo.recurringCustom) {
          recur.textContent = `Repeats every ${todo.recurringCustom} days`;
        } else {
          recur.textContent =
            todo.recurring.charAt(0).toUpperCase() +
            todo.recurring.slice(1) +
            " repeat";
        }
      } else {
        recur.textContent = "";
      }
      const btn = li.querySelector(".toggle-complete");
      btn.textContent = todo.completed ? "Mark Incomplete" : "Mark Complete";
      btn.className = "toggle-complete";
      btn.onclick = async () => {
        await fetch(`${API_URL}/${todo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !todo.completed }),
          credentials: "include",
        });
        fetchTodos();
      };
    } else {
      li.textContent =
        todo.title +
        " [" +
        capitalize(todo.priority || "medium") +
        "]" +
        (todo.due ? " Due: " + todo.due : "") +
        (todo.recurring
          ? todo.recurring === "custom" && todo.recurringCustom
            ? ` Repeats every ${todo.recurringCustom} days`
            : ` ${capitalize(todo.recurring)} repeat`
          : "");
    }
    if (todo.completed) li.classList.add("completed");
    list.appendChild(li);

    // Schedule notification for each todo
    scheduleNotification(todo);
  });

  updateProgressStats(todos);
  updateProductivityChart(todos);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// AUTH UI LOGIC
async function checkAuth() {
  const res = await fetch(AUTH_URL + "/me", { credentials: "include" });
  const data = await res.json();
  currentUser = data.username;
  updateAuthUI();
}

function updateAuthUI() {
  const userSpan = document.getElementById("auth-user");
  const logoutBtn = document.getElementById("logout-btn");
  const authLinks = document.getElementById("auth-links");
  if (currentUser) {
    userSpan.textContent = `Logged in as ${currentUser}`;
    logoutBtn.style.display = "";
    if (authLinks) authLinks.style.display = "none";
  } else {
    userSpan.textContent = "Anonymous";
    logoutBtn.style.display = "none";
    if (authLinks) authLinks.style.display = "";
  }
  document.getElementById("auth-error").textContent = "";
}

document.getElementById("logout-btn").addEventListener("click", async () => {
  await fetch(AUTH_URL + "/logout", {
    method: "POST",
    credentials: "include",
  });
  await checkAuth();
  fetchTodos();
});

document
  .getElementById("add-todo-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("todo-title").value;
    const priority = document.getElementById("todo-priority").value;
    const due = document.getElementById("todo-due").value;
    const recurring = document.getElementById("todo-recurring").value;
    const recurringCustom =
      recurring === "custom"
        ? parseInt(document.getElementById("todo-recurring-custom").value, 10)
        : undefined;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        priority,
        due,
        recurring,
        recurringCustom,
      }),
    });
    document.getElementById("add-todo-form").reset();
    fetchTodos();
  });

document.getElementById("refresh-btn").addEventListener("click", fetchTodos);

window.onload = () => {
  initDarkMode();
  showInstructionsFirstTime();
  handleRecurringSelect();
  checkAuth().then(fetchTodos);
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
};
