// renderer.js
let currentPath;

window.api.receive('dirname', (data) => {
  currentPath = data; // This will set the __dirname
  console.log(currentPath); // This will log the __dirname
});

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksDiv = document.getElementById('tasks');

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = taskInput.value;
    taskInput.value = '';
    addTask(newTask);
});



async function displayTasks() {
    const tasks = await getTasks();
    tasksDiv.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('p');
        taskElement.textContent = task;
        tasksDiv.appendChild(taskElement);
    });
}

window.onload = displayTasks;