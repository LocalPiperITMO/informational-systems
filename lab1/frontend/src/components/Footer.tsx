import React from 'react';

interface FooterProps {
    role: string;
}

const Footer: React.FC<FooterProps> = ({ role }) => {
  const footerStyle = {
    backgroundColor: role == 'admin' ? 'red' : role == 'user' ? 'green' : 'grey',
    color: 'white',
    padding: '10px',
  };

  return (
    <footer style={footerStyle}>
      <p>Contact: your.email@example.com | GitHub: your-github | Telegram: @your-telegram</p>
    </footer>
  );
};

export default Footer;
