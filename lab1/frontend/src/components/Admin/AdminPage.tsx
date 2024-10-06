import React, { useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Table from '../Table';

const AdminPage: React.FC = () => {
  const { logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Store current page when component mounts
  useEffect(() => {
    localStorage.setItem('currentPage', '/admin');
  }, []);

  return (
    <div>
      <Header role={"admin"} />
      <div style={{ display: 'flex', padding: '20px' }}>
        <aside style={{ flex: '1', marginRight: '20px' }}>
          <h2>Welcome to Admin Panel, {username}</h2>
          <button onClick={handleLogout}>Logout</button>
          {/* Other buttons and logic */}
        </aside>

        <div style={{ flex: '3', overflow: 'auto', height: '400px', border: '1px solid black' }}>
          <Table />
        </div>
      </div>
      <Footer role={"admin"} />
    </div>
  );
};

export default AdminPage;
