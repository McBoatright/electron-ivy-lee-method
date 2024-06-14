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

async function addTask(task) {
    const tasks = await getTasks();
    tasks.push(task);
    if (currentPath) { // Check if currentPath is defined
        await window.api.writeFileSync(window.api.joinPath(currentPath, 'db.json'), JSON.stringify(tasks));
        displayTasks();
    } else {
        console.error('currentPath is undefined');
    }
}

async function getTasks() {
    let tasks = [];
    if (currentPath) { // Check if currentPath is defined
        const tasksJson = await window.api.readFileSync(window.api.joinPath(currentPath, 'db.json'));
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