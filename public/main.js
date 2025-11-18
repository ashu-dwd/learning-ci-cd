const API_URL = "/todos";

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

    // Set title
    if (li.querySelector) {
      li.querySelector(".todo-title").textContent = todo.title;
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
      li.textContent = todo.title;
    }
    if (todo.completed) li.classList.add("completed");
    list.appendChild(li);
  });
}

document
  .getElementById("add-todo-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("todo-title").value;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    document.getElementById("add-todo-form").reset();
    fetchTodos();
  });

document.getElementById("refresh-btn").addEventListener("click", fetchTodos);

window.onload = fetchTodos;
