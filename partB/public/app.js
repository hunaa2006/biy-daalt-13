async function loadTasks(status = '') {
    const url = status ? `/tasks?status=${status}` : '/tasks';
    const response = await fetch(url);
    const result = await response.json();
    
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    result.data.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item ${task.priority} ${task.status}`;
        item.innerHTML = `
            <span>${task.title}</span>
            <button onclick="deleteTask(${task.id})">Устгах</button>
        `;
        taskList.appendChild(item);
    });
}

async function addTask() {
    const title = document.getElementById('taskTitle').value;
    const priority = document.getElementById('taskPriority').value;

    if (!title) return alert("Нэр оруулна уу");

    await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority })
    });

    document.getElementById('taskTitle').value = '';
    loadTasks();
}

async function deleteTask(id) {
    if (confirm('Устгах уу?')) {
        await fetch(`/tasks/${id}`, { method: 'DELETE' });
        loadTasks();
    }
}

loadTasks();