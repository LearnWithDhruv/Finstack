# Task Management Web Application

A full-stack Task Management web application built with Flask (backend) and Angular (frontend). The app allows users to create, update, delete, and filter tasks and task notes, supporting categorization by priority, due dates, and status.

---

##  Technologies Used

### Backend
- Python 3.11
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- SQLite

### Frontend
- Angular 17+
- TypeScript
- Tailwind CSS

---

## Project Structure

```
task-manager/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── database.db
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── ...
│   └── ...
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js & npm
- Angular CLI (`npm install -g @angular/cli`)

---

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The Flask server should now be running at `http://localhost:5000`.

---

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

The Angular app will be available at `http://localhost:4200`.

---

## API Documentation

### Base URL
`http://localhost:5000/api`

### Endpoints

#### `GET /api/tasks`
- Description: Fetch all tasks

#### `POST /api/tasks`
- Description: Create a new task
- Body:

#### `PUT /api/tasks/<id>`
- Description: Update a task
- Body: Same as POST

#### `DELETE /api/tasks/<id>`
- Description: Delete a task by ID

#### `GET /api/tasks/<id>/notes`
- Description: Get all notes for a task

#### `POST /api/tasks/<id>/notes`
- Description: Add a note to a task

#### `DELETE /api/notes/<note_id>`
- Description: Delete a note

---

## Features

- CRUD operations for tasks and notes
- Responsive and clean UI with Angular and Tailwind
- SQLite-based storage (easily switchable to PostgreSQL/MySQL)
- RESTful API using Flask
- Modular code for easy scaling

---

## Author

- Name: Dhruv Khatter
- GitHub: (https://github.com/LearnWithDhruv)
- Email: dhruvkhatter2003@gmail.com

---

## License

This project is licensed under the MIT License.
