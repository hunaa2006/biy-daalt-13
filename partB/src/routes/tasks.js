const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/', (req, res) => {
    const { status, priority, search } = req.query;
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

    try {
        const tasks = db.prepare(query + ' ORDER BY created_at DESC').all(...params);
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/', (req, res) => {
    const { title, description, priority, due_date } = req.body;
    
    if (!title) {
        return res.status(400).json({ success: false, error: 'Гарчиг заавал байх ёстой!' });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO tasks (title, description, priority, due_date) 
            VALUES (?, ?, ?, ?)
        `);
        const info = stmt.run(title, description, priority || 'medium', due_date || null);
        
        res.status(201).json({
            success: true,
            data: { id: info.lastInsertRowid, title, description, priority, due_date }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put('/:id', (req, res) => {
    const { title, description, status, priority, due_date } = req.body;
    const { id } = req.params;

    try {
        const stmt = db.prepare(`
            UPDATE tasks 
            SET title = ?, description = ?, status = ?, priority = ?, due_date = ?
            WHERE id = ?
        `);
        const info = stmt.run(title, description, status, priority, due_date, id);

        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Даалгавар олдсонгүй' });
        }
        res.json({ success: true, message: 'Амжилттай шинэчлэгдлээ' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Даалгавар олдсонгүй' });
        }
        res.json({ success: true, message: 'Даалгавар устгагдлаа' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;