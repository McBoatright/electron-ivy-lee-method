const { ipcRenderer } = require('electron');

let currentPath;

ipcRenderer.on('dirname', (event, dirname) => {
  currentPath = dirname;
});

const noteInput = document.getElementById('note-input');
const saveNoteButton = document.getElementById('save-note');
const notesDiv = document.getElementById('notes');

saveNoteButton.addEventListener('click', () => {
    const newNote = noteInput.value;
    noteInput.value = '';
    saveNote(newNote);
});

async function saveNote(note) {
    const notes = await getNotes();
    notes.push(note);
    if (currentPath) { // Check if currentPath is defined
        const filePath = await ipcRenderer.invoke('join-path', currentPath, 'notes.json');
        await ipcRenderer.invoke('write-file', filePath, JSON.stringify(notes));
        displayNotes();
    } else {
        console.error('currentPath is undefined');
    }
}

async function getNotes() {
    let notes = [];
    if (currentPath) { // Check if currentPath is defined
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
      // Wait for currentPath to be defined
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const notes = await getNotes();
    notesDiv.innerHTML = '';
    notes.forEach((note, index) => {
      const noteElement = document.createElement('p');
      noteElement.textContent = note;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteNote(index));
  
      noteElement.appendChild(deleteButton);
      notesDiv.appendChild(noteElement);
    });
}

async function deleteNote(index) {
  const notes = await getNotes();
  notes.splice(index, 1);
  if (currentPath) { // Check if currentPath is defined
    const filePath = await ipcRenderer.invoke('join-path', currentPath, 'notes.json');
    await ipcRenderer.invoke('write-file', filePath, JSON.stringify(notes));
    displayNotes();
  } else {
    console.error('currentPath is undefined');
  }
}

async function displayTasks() {
    while (!currentPath) {
      // Wait for currentPath to be defined
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const tasks = await getTasks();
    const tasksDiv = document.getElementById('tasks');
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

window.onload = () => {
  displayTasks();
  displayNotes();
};