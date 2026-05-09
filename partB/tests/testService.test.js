const TaskService = require('../src/services/taskService');
const db = require('../src/database');

describe('TaskService Unit Tests', () => {
    // Тест бүрийн өмнө өгөгдлийн санг цэвэрлэх
    beforeEach(() => {
        db.prepare('DELETE FROM tasks').run();
    });

    // 1. Шинэ даалгавар амжилттай үүсгэх
    test('createTask should add a new task', () => {
        const result = TaskService.createTask({ title: 'Test Task', priority: 'high' });
        expect(result.changes).toBe(1);
    });

    // 2. Бүх даалгаврыг жагсааж авах
    test('getAllTasks should return all tasks', () => {
        TaskService.createTask({ title: 'Task 1' });
        TaskService.createTask({ title: 'Task 2' });
        const tasks = TaskService.getAllTasks({});
        expect(tasks.length).toBe(2);
    });

    // 3. Статусаар шүүх (pending)
    test('getAllTasks should filter by status', () => {
        TaskService.createTask({ title: 'Pending Task', status: 'pending' });
        const tasks = TaskService.getAllTasks({ status: 'pending' });
        expect(tasks[0].title).toBe('Pending Task');
    });

    // 4. Тэргүүлэх чиглэлээр шүүх (high)
    test('getAllTasks should filter by priority', () => {
        TaskService.createTask({ title: 'High Priority', priority: 'high' });
        const tasks = TaskService.getAllTasks({ priority: 'high' });
        expect(tasks[0].priority).toBe('high');
    });

    // 5. Хайлт хийх (search)
    test('getAllTasks should search by title', () => {
        TaskService.createTask({ title: 'Learning Node.js' });
        const tasks = TaskService.getAllTasks({ search: 'Node' });
        expect(tasks.length).toBe(1);
    });

    // 6. Даалгавар устгах
    test('deleteTask should remove task by id', () => {
        const info = TaskService.createTask({ title: 'Delete me' });
        const result = TaskService.deleteTask(info.lastInsertRowid);
        expect(result.changes).toBe(1);
    });

    // 7. Байхгүй ID-тай даалгавар устгах (Edge case)
    test('deleteTask should return 0 changes for non-existing id', () => {
        const result = TaskService.deleteTask(999);
        expect(result.changes).toBe(0);
    });

    // 8. Даалгавар шинэчлэх (Update)
    test('updateTask should change task status', () => {
        const info = TaskService.createTask({ title: 'Update me', status: 'pending' });
        TaskService.updateTask(info.lastInsertRowid, { 
            title: 'Updated', status: 'completed', priority: 'low' 
        });
        const tasks = TaskService.getAllTasks({});
        expect(tasks[0].status).toBe('completed');
    });

    // 9. Хоосон утгаар шинэчлэх (Edge case)
    test('updateTask should return 0 changes for non-existing id', () => {
        const result = TaskService.updateTask(999, { title: 'No' });
        expect(result.changes).toBe(0);
    });

    // 10. Due date хадгалагдаж байгааг шалгах
    test('createTask should store due_date correctly', () => {
        const date = '2026-12-31';
        TaskService.createTask({ title: 'Future Task', due_date: date });
        const tasks = TaskService.getAllTasks({});
        expect(tasks[0].due_date).toBe(date);
    });
});