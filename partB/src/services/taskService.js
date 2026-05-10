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

    getTaskById(id) {
        const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
        return stmt.get(id);
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
        const fields = [];
        const values = [];

        // Зөвхөн өгөгдсөн field-үүдийг обновить хийх
        if (data.title !== undefined && data.title !== null) {
            fields.push('title = ?');
            values.push(data.title);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }
        if (data.status !== undefined) {
            fields.push('status = ?');
            values.push(data.status);
        }
        if (data.priority !== undefined) {
            fields.push('priority = ?');
            values.push(data.priority);
        }
        if (data.due_date !== undefined) {
            fields.push('due_date = ?');
            values.push(data.due_date);
        }

        if (fields.length === 0) {
            return { changes: 0 };
        }

        values.push(id);
        const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
        const stmt = db.prepare(query);
        return stmt.run(...values);
    },

    deleteTask(id) {
        return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    }
};

module.exports = TaskService;