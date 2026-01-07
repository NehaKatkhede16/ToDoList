# Database Connectivity with Node.js and SQLite

This project has been upgraded from simple browser LocalStorage to a robust **Node.js** backend with **SQLite** database.

## Why Database Connectivity?

1.  **Persistence**: Unlike LocalStorage, which can be cleared by the user or browser (incognito mode), a database ensures your data is safely stored on the server/disk.
2.  **Scalability**: A database allows for advanced querying, sorting, and handling of thousands of items efficiently.
3.  **Centralization**: Allows the application to be accessed from different browsers or devices (if hosted) while seeing the same data.

## Why This Tech Stack?

-   **Node.js & Express**: Fast, lightweight, and perfect for building JSON APIs.
-   **SQLite**: A file-based SQL database. It requires no separate server installation (unlike MySQL/PostgreSQL), making it perfect for efficient local development and small-to-medium JavaScript applications.

## Technologies Used

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript | User Interface and Client-side logic. |
| **Backend** | Node.js, Express.js | Server-side logic and API endpoints. |
| **Database** | SQLite | Storing tasks persistently in a file (`todo.db`). |
| **Communication**| Fetch API | Sending data between Frontend and Backend. |

## GitHub & Database

When uploading this project to GitHub, you should **NOT** upload:
1.  `node_modules/` folder (it's too heavy; users install it via `npm install`).
2.  `todo.db` (usually). Database files contain local data. It is better to let the server create a fresh database code when someone else runs it.

**Note:** I have created a `.gitignore` file for you that handles this automatically.

## How to Run

1.  **Install Dependencies**:
    ```bash
   npm error code ENOENT
npm error syscall open
npm error path D:\7TH SEM\To-Do List\package.json
npm error errno -4058
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open 'D:\7TH SEM\To-Do List\package.json'
npm error enoent This is related to npm not being able to find a file.
npm error enoent

npm error A complete log of this run can be found in: C:\Users\nehak\AppData\Local\npm-cache\_logs\2026-01-07T06_10_50_891Z-debug-0.log
PS D:\7TH SEM\To-Do List>
    ```
    *(This installs express, sqlite3, etc.)*

2.  **Start the Server**:
    ```bash
    node server.js
    ```
    *(The server will start at http://localhost:3000)*

3.  **Open the App**:
    Open your browser and go to `http://localhost:3000` (since the server also serves the static files) or simply open `index.html`.
