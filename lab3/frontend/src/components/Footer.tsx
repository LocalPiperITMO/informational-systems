import React from "react";
import '../styles/Footer.css';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <Container>
                <Row className="align-items-center">
                    <Col className="text-start">
                        <p>Email: artsor53@gmail.com</p>
                    </Col>
                    <Col className="text-center">
                        <p>
                            GitHub: <a href="https://github.com/LocalPiper">LocalPiper</a>
                        </p>
                    </Col>
                    <Col className="text-end">
                        <p>
                            Telegram: <a href="https://t.me/localpiper">@localpiper</a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
