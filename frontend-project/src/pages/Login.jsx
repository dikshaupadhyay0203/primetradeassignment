import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Decode JWT payload in browser and read role without extra dependencies.
const getRoleFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || 'user';
    } catch (error) {
        return 'user';
    }
};

function Login(){
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[message, setMessage] = useState('');
    const[errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrorMessage('');
        try {
            const res = await api.post('/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.data.token);
            // Store role after login to drive simple UI behavior in dashboard.
            localStorage.setItem('role', getRoleFromToken(res.data.data.token));
            setMessage(res.data.message || 'Login successful');
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Login failed');
        }   };

        return (
            <div className="auth-page">
                <div className="auth-card">
                <h2>Login</h2>  
                {message && <p>{message}</p>}
                {errorMessage && <p>{errorMessage}</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
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
                    <button type="submit">Login</button>
                </form>
                </div>
            </div>
        );
}
export default Login;
