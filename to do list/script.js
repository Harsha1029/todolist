let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("taskList");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const time = document.getElementById("taskTime").value;

  if (!text || !time) return alert("Fill in all fields");

  tasks.push({ text, time, done: false, notified: false });
  saveTasks();
  renderTasks();
  clearInput();
}

function clearInput() {
  document.getElementById("taskInput").value = "";
  document.getElementById("taskTime").value = "";
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  tasks[index].notified = false;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  taskList.innerHTML = "";
  const search = document.getElementById("searchBox").value.toLowerCase();
  tasks.sort((a, b) => new Date(a.time) - new Date(b.time));

  tasks.forEach((task, index) => {
    if (!task.text.toLowerCase().includes(search)) return;

    const div = document.createElement("div");
    div.className = "task";
    if (new Date(task.time) < new Date() && !task.done) {
      div.classList.add("overdue");
    }

    const span = document.createElement("span");
    span.textContent = task.done ? "✅ " + task.text : task.text;

    const time = document.createElement("small");
    const minsLeft = Math.floor((new Date(task.time) - new Date()) / 60000);
    time.textContent = minsLeft >= 0
      ? `⏱ ${minsLeft} min left`
      : `⚠️ Overdue by ${Math.abs(minsLeft)} min`;
    time.style.marginLeft = "10px";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✔️";
    doneBtn.onclick = () => toggleDone(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => deleteTask(index);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      const newText = prompt("Edit task name:", task.text);
      const newTime = prompt("Edit task time (YYYY-MM-DDTHH:MM):", task.time);
      if (newText && newTime && !isNaN(new Date(newTime))) {
        task.text = newText;
        task.time = newTime;
        saveTasks();
        renderTasks();
      }
    };

    div.append(span, time, doneBtn, editBtn, deleteBtn);
    taskList.appendChild(div);
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

document.getElementById("searchBox").addEventListener("input", renderTasks);

// 🔔 Notification Check (every 30s)
setInterval(() => {
  const now = new Date();
  tasks.forEach((task, i) => {
    const diff = new Date(task.time) - now;
    if (diff > 0 && diff <= 300000 && !task.notified && !task.done) {
      alert(`Reminder: "${task.text}" is due soon!`);
      const audio = document.getElementById("notifySound");
      if (audio) audio.play();
      task.notified = true;
    }
  });
  saveTasks();
}, 30000);

renderTasks();
