import React from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Table from '../Table';

const MainPage: React.FC = () => {
  const { logout, username } = useAuth(); // Add username from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div>
      <Header role={"user"} />
      <div style={{ display: 'flex', padding: '20px' }}>
        <aside style={{ flex: '1', marginRight: '20px' }}>
          <h2>Welcome to Main Page, {username}</h2> {/* Display username */}
          <button>Create</button>
          <button>Update</button>
          <button>Delete</button>
          <button>Visual</button>
          <button>Spec</button>
          <button onClick={handleLogout}>Logout</button>
          <button>Request Admin</button>
        </aside>

        <div style={{ flex: '3', overflow: 'auto', height: '400px', border: '1px solid black' }}>
          <Table />
        </div>
      </div>
      <Footer role={"user"} />
    </div>
  );
};

// Export MainPage component
export default MainPage;
