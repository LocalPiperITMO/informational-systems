import React, { useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Table from '../Table';
import '../../styles/MainPage.css'; // Importing style file

const MainPage: React.FC = () => {
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

  const handleRequestAdmin = () => {
    console.log("Request Admin button clicked");
  };

  const handleSpecial = () => {
    console.log("Special button clicked");
  };

  useEffect(() => {
    localStorage.setItem('currentPage', '/main');
  }, []);

  return (
    <div>
      <Header role={"user"} />
      <div className="main-page-container">
            <div className="main-content">
              <aside className="sidebar">
                <h2>Welcome to Main Page, {username}</h2>
                <div className="button-container">
                  <button onClick={handleCreate}>Create</button>
                  <button onClick={handleUpdate}>Update</button>
                  <button onClick={handleDelete}>Delete</button>
                  <button onClick={handleRequestAdmin}>Request Admin</button>
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
          <Footer role={"user"} />
    </div>
  );
};

export default MainPage;
