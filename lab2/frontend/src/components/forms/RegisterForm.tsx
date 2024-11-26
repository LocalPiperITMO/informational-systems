import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";
import '../../styles/RegisterForm.css';

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const { username: returnedUsername, admin, token } = await registerUser(username, password);
            login(returnedUsername, admin, token);
            navigate('/main');
        } catch (error) {
            console.error("register failed", error);
        }
    };

    return (
        <div className="register-form">
            <h2>Register</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="form-control" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="form-control" />
            <button onClick={handleRegister} className="btn btn-success">Register</button>
        </div>
    );
}

export default RegisterForm;
