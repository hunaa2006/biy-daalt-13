const express = require('express');
const router = express.Router();
const TaskService = require('../services/taskService');

router.get('/', (req, res) => {
    try {
        const tasks = TaskService.getAllTasks(req.query);
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ success: false, error: 'Гарчиг заавал байх ёстой!' });
    }

    try {
        const info = TaskService.createTask(req.body);
        res.status(201).json({
            success: true,
            data: { id: info.lastInsertRowid, ...req.body }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put('/:id', (req, res) => {
    try {
        const info = TaskService.updateTask(req.params.id, req.body);
        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Даалгавар олдсонгүй' });
        }
        res.json({ success: true, message: 'Амжилттай шинэчлэгдлээ' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.patch('/:id', (req, res) => {
    try {
        const task = TaskService.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Даалгавар олдсонгүй' });
        }
        
        // Статусыг өөрчлөх (pending -> completed, completed -> pending)
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const info = TaskService.updateTask(req.params.id, { status: newStatus });
        
        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Даалгавар олдсонгүй' });
        }
        res.json({ success: true, message: 'Статус шинэчлэгдлээ' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.delete('/:id', (req, res) => {
    try {
        const info = TaskService.deleteTask(req.params.id);
        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Даалгавар олдсонгүй' });
        }
        res.json({ success: true, message: 'Даалгавар устгагдлаа' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;