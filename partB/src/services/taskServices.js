const db = require('../database');

const TaskService = {
    getAllTasks(filters) {
        const { status, priority, search } = filters;
        let query = 'SELECT * FROM tasks WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (priority) {
            query += ' AND priority = ?';
            params.push(priority);
        }
        if (search) {
            query += ' AND title LIKE ?';
            params.push(`%${search}%`);
        }

        return db.prepare(query + ' ORDER BY created_at DESC').all(...params);
    },

    createTask(data) {
        const { title, description, priority, due_date } = data;
        const stmt = db.prepare(`
            INSERT INTO tasks (title, description, priority, due_date) 
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(title, description, priority || 'medium', due_date || null);
    },

    updateTask(id, data) {
        const { title, description, status, priority, due_date } = data;
        const stmt = db.prepare(`
            UPDATE tasks 
            SET title = ?, description = ?, status = ?, priority = ?, due_date = ?
            WHERE id = ?
        `);
        return stmt.run(title, description, status, priority, due_date, id);
    },

    deleteTask(id) {
        return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    }
};

module.exports = TaskService;