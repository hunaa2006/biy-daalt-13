let tasks = [];

// Даалгавруудыг ачаалах
async function loadTasks() {
    try {
        const res = await fetch('/tasks');
        const result = await res.json();
        tasks = result.data || [];
        render();
    } catch (err) {
        console.error("Ачаалахад алдаа гарлаа:", err);
    }
}

// Дэлгэцэнд зурах
function render(filter = 'all') {
    const list = document.getElementById('taskList');
    if (!list) return;
    
    list.innerHTML = '';
    
    const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
    document.getElementById('taskCount').innerText = `Нийт: ${filtered.length}`;

    if (filtered.length === 0) {
        list.innerHTML = '<p class="empty" style="text-align:center; padding:20px; color:#999;">Хоосон байна</p>';
        return;
    }

    filtered.forEach(t => {
        const div = document.createElement('div');
        div.className = `task-card ${t.priority}`;
        div.innerHTML = `
            <div class="info">
                <strong class="${t.status}">${t.title}</strong>
                <small style="display:block; color:#888;">${t.priority}</small>
            </div>
            <div class="actions">
                <button onclick="toggle(${t.id})">${t.status === 'pending' ? '✅' : '🔄'}</button>
                <button onclick="del(${t.id})" class="btn-del">🗑️</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Шинэ даалгавар нэмэх
async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const priorityInput = document.getElementById('taskPriority');
    
    const title = titleInput.value.trim();
    const priority = priorityInput.value;

    if (!title) {
        alert("Нэр оруулна уу!");
        return;
    }

    try {
        const res = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, priority })
        });

        const result = await res.json();

        if (res.ok && result.success) {
            titleInput.value = '';
            await loadTasks();
        } else {
            alert("Алдаа: " + (result.error || "Нэмж чадсангүй"));
        }
    } catch (err) {
        alert("Сервертэй холбогдож чадсангүй.");
    }
}

// Устгах
async function del(id) {
    if (!confirm("Устгах уу?")) return;
    try {
        await fetch(`/tasks/${id}`, { method: 'DELETE' });
        await loadTasks();
    } catch (err) {
        console.error(err);
    }
}

// Төлөв солих
async function toggle(id) {
    try {
        await fetch(`/tasks/${id}`, { method: 'PATCH' });
        await loadTasks();
    } catch (err) {
        console.error(err);
    }
}

// Шүүлтүүр
function filterTasks(f) {
    // Товчлууруудын идэвхтэй стилийг солих
    document.querySelectorAll('.btns button').forEach(btn => btn.classList.remove('active'));
    render(f);
}

// Функцүүдийг global болгох (HTML-ээс дуудахад алдаа гаргахгүй тулд)
window.addTask = addTask;
window.del = del;
window.toggle = toggle;
window.filterTasks = filterTasks;

// Хуудас ачаалагдахад
document.addEventListener('DOMContentLoaded', loadTasks);