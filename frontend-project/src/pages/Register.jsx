import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const[name, setName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[role, setRole] = useState('user');
    const[message, setMessage] = useState('');
    const[errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrorMessage('');
        try {
            const res = await api.post('/auth/register', {
                name,
                email,
                password,
                role,
            });
            localStorage.setItem('token', res.data.data.token);
            setMessage(res.data.message || 'Registration successful');
            navigate("/login");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
            <h2>Register</h2>
            {message && <p>{message}</p>}
            {errorMessage && <p>{errorMessage}</p>}
            <form className="auth-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* Role selector for RBAC testing and admin/user account creation */}
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Register</button>
            </form>
            </div>
        </div>
    );
        }
export default Register;