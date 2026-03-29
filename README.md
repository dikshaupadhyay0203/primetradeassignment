# MERN Task Management System

A full-stack task management application built with the MERN stack.
It includes JWT-based authentication, role-based access control, and task CRUD operations.
The project is designed with modular backend architecture and a simple React frontend.

## Tech Stack

### Backend

- Node.js
- Express.js
- JWT (`jsonwebtoken`)
- `bcrypt`

### Frontend

- React
- React Router
- Axios
- Vite

### Database

- MongoDB
- Mongoose

## Features

- User registration and login
- Password hashing with `bcrypt`
- JWT authentication and protected routes
- Role-based access control (`user` and `admin`)
- Task CRUD APIs
- API versioning with `/api/v1`
- Validation and error handling
- Simple frontend pages: Register, Login, Dashboard

## Folder Structure

```text
mern-test-dikshaupadhyay0203/
|-- backend-project/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   `-- server.js
|-- frontend-project/
|   |-- public/
|   `-- src/
|       |-- pages/
|       |-- services/
|       `-- main.jsx
`-- README.md
```

## Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/dikshaupadhyay0203/primetradeassignment.git
cd primetradeassignment
```

### 2. Install Dependencies

Backend:

```bash
cd backend-project
npm install
```

Frontend:

```bash
cd ../frontend-project
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in `backend-project/` and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the Project

Run backend:

```bash
cd backend-project
node server.js
```

Run frontend (new terminal):

```bash
cd frontend-project
npm run dev
```

Frontend URL: `http://localhost:5173`
Backend URL: `http://localhost:5000`

## Environment Variables

- `PORT`: Backend server port
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key used to sign JWT tokens

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Auth

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive token

### Tasks

- `POST /tasks` - Create task (protected)
- `GET /tasks` - Get tasks (protected)
- `PUT /tasks/:id` - Update task (protected)
- `DELETE /tasks/:id` - Delete task (protected)

## Role-Based Access

- `user`: Can access and manage only own tasks.
- `admin`: Can view all tasks in dashboard/API.

## Security

- JWT authentication for protected routes
- Password hashing using `bcrypt`
- Role checks through middleware
- Input validation and structured error responses

## Scalability Notes

- Move modules toward microservices architecture
- Add Redis caching for high-frequency reads
- Use load balancing for horizontal scaling
- Containerize services using Docker

## Future Improvements

- Add refresh token flow and secure cookie strategy
- Add unit/integration tests (Jest + Supertest)
- Add Swagger/OpenAPI documentation
- Add CI/CD pipeline for automated deployment
