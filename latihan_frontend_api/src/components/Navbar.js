import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppNavbar() {
//   const navigate = useNavigate();
//   // Cek apakah ada token di localStorage
//   const token = localStorage.getItem('token');
    const { isAuthenticated, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//   };

//     navigate('/login');
//   };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? "/dashboard" : "/"}>
          Latihan App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              // Menu jika sudah login
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Button 
                  variant="outline-danger" 
                  onClick={logout}
                  size="sm"
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              // Menu jika belum login
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;