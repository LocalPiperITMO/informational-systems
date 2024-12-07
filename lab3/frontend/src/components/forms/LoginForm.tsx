import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import '../../styles/LoginForm.css';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const { username: returnedUsername, admin, token } = await loginUser(username, password);
            login(returnedUsername, admin, token);
            navigate((admin) ? '/admin' : '/main');
        } catch (error) {
            console.error("login failed", error);
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="form-control" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="form-control" />
            <button onClick={handleLogin} className="btn btn-primary">Login</button>
        </div>
    );
}

export default LoginForm;
