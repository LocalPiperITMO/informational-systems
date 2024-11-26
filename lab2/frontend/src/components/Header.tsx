import React from "react";
import '../styles/Header.css';
import { Container, Row, Col } from 'react-bootstrap';

const Header: React.FC = () => {
    return (
        <header className="header">
            <Container>
                <Row className="align-items-center">
                    <Col className="text-start">
                        <h1>Informational Systems</h1>
                    </Col>
                    <Col className="text-center">
                        <h2>Lab1</h2>
                    </Col>
                    <Col className="text-end">
                        <h3>Variant 12086</h3>
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

export default Header;
