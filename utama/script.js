const form = document.getElementById("taskForm");
const taskGrid = document.getElementById("taskGrid");

// Ambil data dari localStorage saat load
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Tambah task
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = document.getElementById("task").value;
  const taskDate = document.getElementById("date").value;

  if (taskText.trim() === "" || taskDate === "") {
    alert("Isi task dan tanggal terlebih dahulu!");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    date: taskDate,
    done: false,
    priority: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  form.reset();
});

// Simpan ke localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render task cards
function renderTasks() {
  taskGrid.innerHTML = "";

  // Urutkan: prioritas dulu
  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  sortedTasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
      <h4>${task.text}</h4>
      <p>📅 ${task.date}</p>
      <div class="task-actions">
        <button class="star">${task.priority ? "⭐" : "☆"}</button>
        <button class="done">${task.done ? "✅" : "☑️"}</button>
        <button class="delete">🗑️</button>
      </div>
    `;

    // Event tombol
    card.querySelector(".star").addEventListener("click", () => {
      task.priority = !task.priority;
      saveTasks();
      renderTasks();
    });

    card.querySelector(".done").addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    card.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskGrid.appendChild(card);
  });
}
