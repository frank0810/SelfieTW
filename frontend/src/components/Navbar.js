import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';


const NavigationBar = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="p-0"> {/* Rimuove il padding esterno */}
      <Navbar.Brand as={Link} to="/" className="ml-3">SelfieApp</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {isAuthenticated && (
          <>
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/pomodoro">Pomodoro</Nav.Link>
              <Nav.Link as={Link} to="/calendar">Calendario</Nav.Link>
              <Nav.Link as={Link} to="/notes">Note</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/profile">Profilo</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;