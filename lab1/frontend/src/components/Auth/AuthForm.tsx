import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import '../../styles/AuthForm.css';

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const url = isRegister ? 'http://localhost:8080/api/auth/register' : 'http://localhost:8080/api/auth/login';
    const data = { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network Error');
      }

      const result = await response.json();
      setSuccessMessage(result.message);

      localStorage.setItem('sessionId', result.sessionId);
      login(result.admin, result.username, result.sessionId);

      const targetPage = result.admin ? '/admin' : '/main';
      localStorage.setItem('currentPage', targetPage);
      navigate(targetPage);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="wrapper">
      <Header role=""/>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </label>
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
          <button type="submit" className="btn btn-primary">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
      </div>

      <button className="btn btn-link" onClick={() => setIsRegister(!isRegister)}>
        Switch to {isRegister ? 'Login' : 'Register'}
      </button>

      <Footer role=""/>
    </div>
  );
};

export default AuthForm;