const fs = require('fs');
const path = require('path');

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksDiv = document.getElementById('tasks');

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = taskInput.value;
    taskInput.value = '';
    addTask(newTask);
});

function addTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(tasks));
    displayTasks();
}

function getTasks() {
    const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
    return tasks;
}

function displayTasks() {
    const tasks = getTasks();
    tasksDiv.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('p');
        taskElement.textContent = task;
        tasksDiv.appendChild(taskElement);
    });
}

window.onload = displayTasks;