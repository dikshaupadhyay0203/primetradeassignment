[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ZroWLq75)

# -mern-test-template

## MERN Task Manager - API v1

This project exposes versioned APIs under `/api/v1`.

### Authentication

- `POST /api/v1/auth/register`
  - Body: `{ "name": "...", "email": "...", "password": "...", "role": "user|admin (optional)" }`
  - Creates a user with bcrypt-hashed password and returns JWT.

- `POST /api/v1/auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Validates credentials and returns JWT.

### Tasks

- `POST /api/v1/tasks`
  - Protected route (JWT)
  - Body: `{ "title": "...", "description": "..." }`

- `GET /api/v1/tasks`
  - Protected route (JWT)
  - `user` gets only own tasks, `admin` gets all tasks.

- `PUT /api/v1/tasks/:id`
  - Protected route (JWT)
  - Owner or admin can update task fields.

- `DELETE /api/v1/tasks/:id`
  - Protected route (JWT)
  - Owner or admin can delete task.

- `GET /api/v1/tasks/admin/all`
  - Protected route (JWT + admin role only)

### Standard JSON Response Format

Success:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "...",
  "error": "..."
}
```

### Security and Validation

- Password hashing with `bcrypt`
- JWT authentication for protected routes
- Input validation for required fields, email format, password length
- Basic input sanitization for text fields

### Scalability Suggestions

- Add Redis caching for frequent task reads
- Containerize with Docker for predictable deployment
- Split auth/task modules into separate services when scaling
