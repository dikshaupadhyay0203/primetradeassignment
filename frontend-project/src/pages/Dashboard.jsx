import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('user');
  const [currentUserId, setCurrentUserId] = useState('');
  const navigate = useNavigate();

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || '';
    } catch (error) {
      return '';
    }
  };

  const isOwnTask = (task) => {
    const ownerId = typeof task.userId === 'object' ? task.userId?._id : task.userId;
    const legacyOwnerId = typeof task.createdBy === 'object' ? task.createdBy?._id : task.createdBy;
    return ownerId === currentUserId || legacyOwnerId === currentUserId;
  };

  const fetchTasks = async () => {
    try {
      setErrorMessage('');
      const res = await api.get('/tasks');
      setTasks(res.data.data || []);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to load tasks');
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      setMessage('');
      setErrorMessage('');
      await api.post('/tasks', { title, description });

      setTitle("");
      setDescription("");
      setMessage('Task created successfully');
      fetchTasks();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create task');
    }
  };

  const deleteTask = async (id) => {
    try {
      setMessage('');
      setErrorMessage('');
      await api.delete(`/tasks/${id}`);
      setMessage('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const saveUpdate = async (id) => {
    try {
      setMessage('');
      setErrorMessage('');
      await api.put(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });

      setEditingTask(null);
      setEditTitle("");
      setEditDescription("");
      setEditStatus("pending");
      setMessage('Task updated successfully');
      fetchTasks();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update task');
    }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status || "pending");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Read role captured during login so UI can label scope correctly.
    setRole(localStorage.getItem('role') || 'user');
    setCurrentUserId(getUserIdFromToken(token));
    fetchTasks();
  }, [navigate]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button className="btn-secondary" type="button" onClick={logout}>Logout</button>
      </div>

      {message && <p>{message}</p>}
      {errorMessage && <p>{errorMessage}</p>}

      <form className="task-form" onSubmit={createTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">Create Task</button>
      </form>

      {role === 'admin' && <p>Admin can modify only own tasks.</p>}

      <h3>{role === 'admin' ? 'All Tasks' : 'Your Tasks'}</h3>

      <div className="task-list">
      {tasks.map((task) => (
        <div className="task-card" key={task._id}>
          {editingTask === task._id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="pending">pending</option>
                <option value="in progress">in progress</option>
                <option value="completed">completed</option>
              </select>

              <button className="btn-primary" type="button" onClick={() => saveUpdate(task._id)}>Save</button>
            </>
          ) : (
            <>
              <p className="task-title">
                {task.title} - {task.status}
              </p>
              <p className="task-description">{task.description}</p>
              {isOwnTask(task) && <div className="task-actions">
                <button className="btn-secondary" type="button" onClick={() => startEdit(task)}>Edit</button>
                <button className="btn-danger" type="button" onClick={() => deleteTask(task._id)}>Delete</button>
              </div>}
            </>
          )}
        </div>
      ))}
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
