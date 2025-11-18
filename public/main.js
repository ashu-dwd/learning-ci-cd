const API_URL = "/todos";

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

async function fetchTodos() {
  const res = await fetch(API_URL);
  const todos = await res.json();
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  const template = document.getElementById("todo-item-template");
  todos.forEach((todo) => {
    const li = template
      ? template.content.cloneNode(true).querySelector("li")
      : document.createElement("li");

    // Set title and priority
    if (li.querySelector) {
      li.querySelector(".todo-title").textContent = todo.title;
      const prio = li.querySelector(".todo-priority");
      prio.textContent = ` [${capitalize(todo.priority || "medium")}]`;
      prio.setAttribute(
        "data-priority",
        (todo.priority || "medium").toLowerCase()
      );
      const btn = li.querySelector(".toggle-complete");
      btn.textContent = todo.completed ? "Mark Incomplete" : "Mark Complete";
      btn.className = "toggle-complete";
      btn.onclick = async () => {
        await fetch(`${API_URL}/${todo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !todo.completed }),
        });
        fetchTodos();
      };
    } else {
      li.textContent =
        todo.title + " [" + capitalize(todo.priority || "medium") + "]";
    }
    if (todo.completed) li.classList.add("completed");
    list.appendChild(li);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

document
  .getElementById("add-todo-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("todo-title").value;
    const priority = document.getElementById("todo-priority").value;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority }),
    });
    document.getElementById("add-todo-form").reset();
    fetchTodos();
  });

document.getElementById("refresh-btn").addEventListener("click", fetchTodos);

window.onload = () => {
  initDarkMode();
  showInstructionsFirstTime();
  fetchTodos();
};
