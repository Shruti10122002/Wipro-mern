const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = taskText;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("task-buttons");

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", () => editTask(span));

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => li.remove());

  buttonDiv.appendChild(editBtn);
  buttonDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(buttonDiv);

  taskList.appendChild(li);
  taskInput.value = "";
}

// Edit / Update task
function editTask(span) {
  const updatedText = prompt("Update your task:", span.textContent);
  if (updatedText !== null && updatedText.trim() !== "") {
    span.textContent = updatedText.trim();
  }
}

// Event listener for Add Task button
addTaskButton.addEventListener("click", addTask);

// Allow pressing Enter to add task
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
