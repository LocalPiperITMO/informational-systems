import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";

const RegisterForm : React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

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
        <div>
            <h2>Register</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}

export default RegisterForm;