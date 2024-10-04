import React from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC<{ username: string }> = ({ username }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div>
      <header style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
        <h1>Informational Systems</h1>
        <h2>Lab 1</h2>
        <h3>Num. 12086</h3>
      </header>

      <div style={{ display: 'flex', padding: '20px' }}>
        <aside style={{ flex: '1', marginRight: '20px' }}>
          <h2>Welcome to Admin Panel, {username}</h2>
          <button>Create</button>
          <button>Update</button>
          <button>Delete</button>
          <button>Visual</button>
          <button>Spec</button>
          <button onClick={handleLogout}>Logout</button>
          <button>Show Requests</button>
        </aside>

        <div style={{ flex: '3', overflow: 'auto', height: '400px', border: '1px solid black' }}>
          <Table />
        </div>
      </div>

      <footer style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
        <p>Contact: your.email@example.com | GitHub: your-github | Telegram: @your-telegram</p>
      </footer>
    </div>
  );
};

const Table: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>Table 1</div>
      {/* Add table implementation for table 1 */}
      <div style={{ marginBottom: '20px' }}>Table 2</div>
      {/* Add table implementation for table 2 */}
      <div style={{ marginBottom: '20px' }}>Table 3</div>
      {/* Add table implementation for table 3 */}
    </div>
  );
};

export default AdminPage;
