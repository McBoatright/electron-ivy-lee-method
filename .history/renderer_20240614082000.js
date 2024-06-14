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
    if (tasks.length < 6) {
        tasks.push(task);
        if (currentPath) { // Check if currentPath is defined
            const filePath = await ipcRenderer.invoke('join-path', currentPath, 'db.json');
            await ipcRenderer.invoke('write-file', filePath, JSON.stringify(tasks));
            displayTasks();
        } else {
            console.error('currentPath is undefined');
        }
    } else {
        console.log("Task limit reached. Please complete a task before adding a new one.");
    }
}

async function getTasks() {
    let tasks = [];
    if (currentPath) { // Check if currentPath is defined
        const filePath = await ipcRenderer.invoke('join-path', currentPath, 'db.json');
        await ipcRenderer.invoke('read-file', filePath)
            .then(tasksJson => {
                if (tasksJson && tasksJson !== 'undefined' && tasksJson !== undefined) {
                    try {
                        tasks = JSON.parse(tasksJson);
                    } catch (error) {
                        console.error(`Failed to parse JSON from file at ${filePath}:`, error);
                    }
                }
            })
            .catch(error => {
                console.error(`Failed to read file at ${filePath}:`, error);
            });
    } else {
        console.error('currentPath is undefined');
    }
    return tasks;
}

async function displayTasks() {
    while (!currentPath) {
      // Wait for currentPath to be defined
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const tasks = await getTasks();
    tasksDiv.innerHTML = '';
    tasks.forEach((task, index) => {
      const taskElement = document.createElement('p');
      taskElement.textContent = task;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteTask(index));
  
      taskElement.appendChild(deleteButton);
      tasksDiv.appendChild(taskElement);
    });
}

async function deleteTask(index) {
  const tasks = await getTasks();
  tasks.splice(index, 1);
  if (currentPath) { // Check if currentPath is defined
    const filePath = await ipcRenderer.invoke('join-path', currentPath, 'db.json');
    await ipcRenderer.invoke('write-file', filePath, JSON.stringify(tasks));
    displayTasks();
  } else {
    console.error('currentPath is undefined');
  }
}

window.onload = displayTasks;