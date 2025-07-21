// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Navbar, Nav } from 'react-bootstrap';
// import logo from '../../imgs/logo.png'; 

// const MobileNavbar = ({ isAuthenticated }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <Navbar bg="light" expand="lg" className="p-0 w-100">
//       <Navbar.Brand as={Link} to="/" className="ms-3">
//         <img
//           src={logo}
//           alt='Selfie App Logo - a very cute sloth'
//           style={{ width: '40px', height: 'auto', marginRight: '10px' }}
//         />
//         SelfieApp
//       </Navbar.Brand>
//       {isAuthenticated && (
//         <>
//         <Navbar.Toggle aria-controls="mobile-navbar" />
        
//         <Navbar.Collapse id="mobile-navbar">

//             <Nav className="w-100">
//               <Nav.Link as={Link} to="/pomodoro">Pomodoro</Nav.Link>
//               <Nav.Link as={Link} to="/calendar">Calendario</Nav.Link>
//               <Nav.Link as={Link} to="/notes">Note</Nav.Link>
//               <Nav.Link as={Link} to="/profile">Profilo</Nav.Link>
//               <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
//             </Nav>
        
//         </Navbar.Collapse>
//         </>
//       )}
//     </Navbar>
//   );
// };

// export default MobileNavbar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../imgs/logo.png'; 

const MobileNavbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="p-0 w-100">
      <Navbar.Brand as={Link} to="/" className="ms-3">
        <img
          src={logo}
          alt='Selfie App Logo - a very cute sloth'
          style={{ width: '40px', height: 'auto', marginRight: '10px' }}
        />
        SelfieApp
      </Navbar.Brand>
      {isAuthenticated && (
        <>
          <Navbar.Toggle 
            aria-controls="mobile-navbar" 
            className="me-3" // Aggiunto padding a destra
          />
          
          <Navbar.Collapse id="mobile-navbar">
            <Nav className="w-100">
              <Nav.Link as={Link} to="/pomodoro">Pomodoro</Nav.Link>
              <Nav.Link as={Link} to="/calendar">Calendario</Nav.Link>
              <Nav.Link as={Link} to="/notes">Note</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profilo</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
};

export default MobileNavbar;