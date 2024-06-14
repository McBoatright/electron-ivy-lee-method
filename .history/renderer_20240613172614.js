// In your renderer.js
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
    await window.api.writeFileSync(window.api.joinPath(__dirname, 'db.json'), JSON.stringify(tasks));
    displayTasks();
}

async function getTasks() {
    const tasks = JSON.parse(await window.api.readFileSync(window.api.joinPath(__dirname, 'db.json')));
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