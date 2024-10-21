import React from "react";
import '../styles/Footer.css';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <Container>
                <Row className="align-items-center">
                    <Col className="text-start">
                        <p>Email: your.email@example.com</p>
                    </Col>
                    <Col className="text-center">
                        <p>
                            GitHub: <a href="https://github.com/yourusername">yourusername</a>
                        </p>
                    </Col>
                    <Col className="text-end">
                        <p>
                            Telegram: <a href="https://t.me/yourusername">@yourusername</a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
