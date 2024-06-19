const { ipcRenderer } = require('electron');

let currentPath = '/home/michael/electron-ivy-lee-method';
// Listen for the 'dirname' message
ipcRenderer.on('dirname', (event, dirname) => {
  currentPath = dirname;
});

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksDiv = document.getElementById('tasks');

const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const notesDiv = document.getElementById('notes');

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = taskInput.value;
    taskInput.value = '';
    addTask(newTask);
});

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newNote = noteInput.value;
    noteInput.value = '';
    addNote(newNote);
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
        alert('You have reached the maximum number of tasks (6).');
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
    const tasks = await getTasks();
    tasksDiv.innerHTML = ''; // Clear the current tasks from the screen

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('p');
        taskElement.textContent = task;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button'; 
        deleteButton.addEventListener('click', () => deleteTask(task));
        deleteButton.innerHTML = '<i class="fa-solid fa-delete-left" style="color: #a51d2d;"></i>'; // Use a solid left arrow icon
        taskElement.appendChild(deleteButton);
        tasksDiv.appendChild(taskElement);
    });
}

async function deleteTask(taskContent) {
    let tasks = await getTasks();
    const index = tasks.indexOf(taskContent);
    if (index > -1) {
        tasks.splice(index, 1);
    }
    if (currentPath) { // Check if currentPath is defined
        const filePath = await ipcRenderer.invoke('join-path', currentPath, 'db.json');
        await ipcRenderer.invoke('write-file', filePath, JSON.stringify(tasks))
            .then(() => {
                displayTasks(); // Update the tasks display after a task is deleted
            })
            .catch(error => {
                console.error(`Failed to write file at ${filePath}:`, error);
            });
    } else {
        console.error('currentPath is undefined');
    }
}

async function addNote(note) {
    const notes = await getNotes();
    notes.push(note);
    if (currentPath) {
        const filePath = await ipcRenderer.invoke('join-path', currentPath, 'notes.json');
        await ipcRenderer.invoke('write-file', filePath, JSON.stringify(notes));
        displayNotes();
    } else {
        console.error('currentPath is undefined');
    }
}

async function getNotes() {
    let notes = [];
    if (currentPath) {
        const filePath = await ipcRenderer.invoke('join-path', currentPath, 'notes.json');
        await ipcRenderer.invoke('read-file', filePath)
            .then(notesJson => {
                if (notesJson && notesJson !== 'undefined' && notesJson !== undefined) {
                    try {
                        notes = JSON.parse(notesJson);
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
    return notes;
}

async function displayNotes() {
    while (!currentPath) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const notes = await getNotes();
    notesDiv.innerHTML = '';
    notes.forEach((note, index) => {
      const noteElement = document.createElement('p');
      noteElement.textContent = note;
  
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button'; 
      deleteButton.addEventListener('click', () => deleteNote(index));
      deleteButton.innerHTML = '<i class="fa-solid fa-delete-left" style="color: #a51d2d;</i>"></i>'; // Use a solid left arrow icon
      noteElement.appendChild(deleteButton);
      notesDiv.appendChild(noteElement);
    });
}

async function deleteNote(index) {
  const notes = await getNotes();
  notes.splice(index, 1);
  if (currentPath) {
    const filePath = await ipcRenderer.invoke('join-path', currentPath, 'notes.json');
    await ipcRenderer.invoke('write-file', filePath, JSON.stringify(notes));
    displayNotes();
  } else {
    console.error('currentPath is undefined');
  }
}

window.onload = () => {
    const dateInput = document.getElementById('date-input');
    
    const savedDate = localStorage.getItem('date');
    if (savedDate) {
      dateInput.value = savedDate;
    }
  
    dateInput.addEventListener('change', () => {
      localStorage.setItem('date', dateInput.value);
    });
  
    displayTasks();
    displayNotes();
  };