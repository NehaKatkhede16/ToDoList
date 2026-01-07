// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const totalCountSpan = document.getElementById('total-count');
const pendingCountSpan = document.getElementById('pending-count');
const completedCountSpan = document.getElementById('completed-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const dateDisplay = document.getElementById('date-display');
const toast = document.getElementById('toast');

// API Config
const API_URL = 'http://localhost:3000/tasks';

// State
let tasks = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    displayDate();
});

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

clearCompletedBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        clearCompletedTasks();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value.toLowerCase());
});

// Core Functions

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to load tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error(error);
        showToast('Error loading tasks. Is server running?', 'error');
    }
}

async function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        showToast('Please enter a task!', 'error');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) throw new Error('Failed to add task');

        const newTask = await response.json();
        tasks.unshift(newTask);
        renderTasks();
        taskInput.value = '';
        showToast('Task added successfully');
    } catch (error) {
        console.error(error);
        showToast('Error adding task', 'error');
    }
}

async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !task.completed })
        });

        if (!response.ok) throw new Error('Failed to update task');

        task.completed = !task.completed;
        renderTasks();
    } catch (error) {
        console.error(error);
        showToast('Error updating task', 'error');
    }
}

async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');

        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
        showToast('Task deleted');
    } catch (error) {
        console.error(error);
        showToast('Error deleting task', 'error');
    }
}

async function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Edit task:', task.text);
    if (newText !== null && newText.trim() !== '') {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText.trim() })
            });

            if (!response.ok) throw new Error('Failed to update task');

            task.text = newText.trim();
            renderTasks();
            showToast('Task updated');
        } catch (error) {
            console.error(error);
            showToast('Error updating task', 'error');
        }
    }
}

async function clearCompletedTasks() {
    try {
        const response = await fetch(`${API_URL}/clear/completed`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to clear tasks');

        tasks = tasks.filter(task => !task.completed);
        renderTasks();
        showToast('Completed tasks cleared');
    } catch (error) {
        console.error(error);
        showToast('Error clearing tasks', 'error');
    }
}

function renderTasks(searchQuery = '') {
    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(task => {
        const matchesFilter =
            currentFilter === 'all' ? true :
                currentFilter === 'completed' ? task.completed :
                    !task.completed;

        const matchesSearch = task.text.toLowerCase().includes(searchQuery);

        return matchesFilter && matchesSearch;
    });

    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-content">
                <button class="check-btn" onclick="toggleTask(${task.id})">
                    <i class="fa-solid fa-check"></i>
                </button>
                <span class="task-text">${escapeHtml(task.text)}</span>
            </div>
            <div class="action-buttons">
                <button class="btn-icon edit-btn" onclick="editTask(${task.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalCountSpan.textContent = total;
    completedCountSpan.textContent = completed;
    pendingCountSpan.textContent = pending;
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.classList.remove('hidden');

    toast.style.animation = 'none';
    toast.offsetHeight;
    toast.style.animation = 'fadeInOut 3s ease forwards';

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function displayDate() {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString('en-US', options);
}
