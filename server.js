const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files (html, css, js)

// Database Setup
const db = new sqlite3.Database('./todo.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            createdDate TEXT
        )`);
    }
});

// Routes

// Get all tasks
app.get('/tasks', (req, res) => {
    db.all("SELECT * FROM tasks ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        // Convert integer 0/1 to boolean for frontend
        const tasks = rows.map(t => ({ ...t, completed: !!t.completed }));
        res.json(tasks);
    });
});

// Create new task
app.post('/tasks', (req, res) => {
    const { text, createdDate } = req.body;
    const sql = "INSERT INTO tasks (text, completed, createdDate) VALUES (?, ?, ?)";
    const params = [text, 0, createdDate || new Date().toISOString()];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            id: this.lastID,
            text: text,
            completed: false,
            createdDate: params[2]
        });
    });
});

// Update task (toggle completion or edit text)
app.put('/tasks/:id', (req, res) => {
    const { text, completed } = req.body;
    const id = req.params.id;

    // Check what fields are provided to build the query dynamically or just update both
    // For simplicity, we assume full object update or specific handling

    let sql = "UPDATE tasks SET text = COALESCE(?, text), completed = COALESCE(?, completed) WHERE id = ?";
    let params = [text, completed === undefined ? undefined : (completed ? 1 : 0), id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "Task updated", changes: this.changes });
    });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "Deleted", changes: this.changes });
    });
});

// Clear completed
app.delete('/tasks/clear/completed', (req, res) => {
    db.run("DELETE FROM tasks WHERE completed = 1", [], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "Completed tasks cleared", changes: this.changes });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
