// MainPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Table from '../Table';
import CreateModal from './CreateModal';
import '../../styles/MainPage.css';

const MainPage: React.FC = () => {
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleCreate = () => {
    setModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setModalVisible(false); // Hide the modal
  };

  const handleSubmit = (data: any) => {
    console.log("Submitted Data:", data);
    setModalVisible(false); // Close the modal after submission
    // Here, you would typically send the data to your backend API
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
              <button onClick={() => console.log("Update button clicked")}>Update</button>
              <button onClick={() => console.log("Delete button clicked")}>Delete</button>
              <button onClick={() => console.log("Request Admin button clicked")}>Request Admin</button>
              <button disabled onClick={() => alert("Feature not available yet")}>Visualize</button>
              <button onClick={() => console.log("Special button clicked")}>Special</button>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          </aside>

          <div className="table-container">
            <Table />
          </div>
        </div>
      </div>
      {modalVisible && (
        <CreateModal onClose={handleModalClose} onSubmit={handleSubmit} />
      )}
      <Footer role={"user"} />
    </div>
  );
};

export default MainPage;
