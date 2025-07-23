import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import ResponsiveNavbar from './NavBar/ResponsiveNavbar';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/auth/login',
        { username, password }
      );
      console.log("Salvo il token:", response.data.token);
      localStorage.setItem('token', response.data.token);
      console.log("Token salvato:", localStorage.getItem('token'));
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login error');
    }
  };

  return (
    <>
      <ResponsiveNavbar isAuthenticated={false} />
      <Container id="login-container">
        <Row className="justify-content-md-center mt-5">
          <Col md={6}>
            <h1 className="text-center">Login</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Login
              </Button>
            </Form>
            <div className="text-center mt-3">
              <span>Non hai un account?</span>
              <Link to="/register">Registrati qui!</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;