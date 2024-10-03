import React from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div>
      <h1>Main Information Page</h1>
      {}
      <p>This is where the main content will go.</p>
      <Clock />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const Clock: React.FC = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return <div>{time.toLocaleTimeString()}</div>;
};

export default MainPage;
