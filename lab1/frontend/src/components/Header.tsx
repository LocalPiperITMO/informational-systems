import React from 'react';

interface HeaderProps {
  role: string;
}

const Header: React.FC<HeaderProps> = ({ role }) => {
  const headerStyle = {
    backgroundColor: role == 'admin' ? 'red' : role == 'user' ? 'green' : 'grey',
    color: 'white',
    padding: '10px',
  };

  return (
    <header style={headerStyle}>
      <h1>Informational Systems</h1>
      <h2>Lab 1</h2>
      <h3>Num. 12086</h3>
    </header>
  );
};

export default Header;
