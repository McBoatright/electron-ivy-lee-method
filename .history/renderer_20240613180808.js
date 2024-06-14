// renderer.js
const { ipcRenderer } = require('electron');

let currentPath;

// Listen for the 'dirname' message
ipcRenderer.on('dirname', (event, dirname) => {
  currentPath = dirname;
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
    const tasks = await getTasks();
    tasks.push(task);
    if (currentPath) { // Check if currentPath is defined
        const filePath = await ipcRenderer.invoke('join-path', currentPath, 'db.json');
        await ipcRenderer.invoke('write-file', filePath, JSON.stringify(tasks));
        displayTasks();
    } else {
        console.error('currentPath is undefined');
    }
}

async function getTasks() {
    let tasks = [];
    if (currentPath) { // Check if currentPath is defined
        const filePath = await ipcRenderer.invoke('join-path', currentPath, 'db.json');
        const tasksJson = await ipcRenderer.invoke('read-file', filePath);
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