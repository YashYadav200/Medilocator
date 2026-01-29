import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">MediLocator</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Home Link Removed */}

                        {user?.role === 'ADMIN' && (
                            <Nav.Link as={Link} to="/admin/dashboard">Admin Dashboard</Nav.Link>
                        )}

                        {user?.role === 'VENDOR' && (
                            <>
                                <Nav.Link as={Link} to="/vendor/dashboard">My Medicines</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <>
                                {user.role === 'USER' && (
                                    <Nav.Link as={Link} to="/search" className="fw-bold">Home</Nav.Link>
                                )}
                                <Nav.Link as={Link} to="/profile" className="fw-bold">My Profile</Nav.Link>
                                <Button variant="outline-light" onClick={handleLogout} className="ms-2">Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                        <Nav.Link as={Link} to="/contact-support">Contact Support</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
