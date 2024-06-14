// renderer.js
let currentPath;
const dirnamePromise = new Promise((resolve) => {
  window.api.receive('dirname', (data) => {
    currentPath = data; // This will set the __dirname
    console.log(currentPath); // This will log the __dirname
    resolve();
  });
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
async function addTask(task) {
    await dirnamePromise; // Wait for the dirname message to be received
    const tasks = await getTasks();
    tasks.push(task);
    if (currentPath) { // Check if currentPath is defined
        const filePath = window.api.joinPath(currentPath, 'db.json');
        await window.api.writeFileSync(filePath, JSON.stringify(tasks));
        displayTasks();
    } else {
        console.error('currentPath is undefined');
    }
}

async function getTasks() {
    await dirnamePromise; // Wait for the dirname message to be received
    let tasks = [];
    if (currentPath) { // Check if currentPath is defined
        const filePath = window.api.joinPath(currentPath, 'db.json');
        const tasksJson = await window.api.readFileSync(filePath);
        if (tasksJson) {
            tasks = JSON.parse(tasksJson);
        }
    } else {
        console.error('currentPath is undefined');
    }
    return tasks;
}
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