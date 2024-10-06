import React, { useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Table from '../Table';
import '../../styles/AdminPage.css'; // Importing style file

const AdminPage: React.FC = () => {
  const { logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleCreate = () => {
    console.log("Create button clicked");
  };

  const handleUpdate = () => {
    console.log("Update button clicked");
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
  };

  const handleListRequests = () => {
    console.log("List Requests button clicked");
  };

  const handleSpecial = () => {
    console.log("Special button clicked");
  };

  useEffect(() => {
    localStorage.setItem('currentPage', '/admin');
  }, []);

  return (
    <div>
      <Header role={"admin"} />
      <div className="admin-page-container">
            <div className="admin-content">
              <aside className="sidebar">
                <h2>Welcome to Admin Panel, {username}</h2>
                <div className="button-container">
                  <button onClick={handleCreate}>Create</button>
                  <button onClick={handleUpdate}>Update</button>
                  <button onClick={handleDelete}>Delete</button>
                  <button onClick={handleListRequests}>List Requests</button>
                  <button disabled onClick={() => alert("Feature not available yet")}>Visualize</button>
                  <button onClick={handleSpecial}>Special</button>
                  <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
              </aside>

              <div className="table-container">
                <Table />
              </div>
            </div>
          </div>
          <Footer role={"admin"} />
    </div>
  );
};

export default AdminPage;
