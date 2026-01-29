import { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginRole, setLoginRole] = useState('USER'); // 'USER', 'VENDOR', 'ADMIN'
    const [error, setError] = useState('');
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { role } = await login(email, password);

            // Enforce Role Restriction
            if (role !== loginRole) {
                // If roles don't match, logout immediately and show error
                // We need to import logout from context, but we can verify if it's available.
                // Actually `useAuth` returns `login`, `register`, `logout`. 
                // We need to destructure logout first.
                throw new Error(`Access Denied. You are registered as ${role}, not ${loginRole}.`);
            }

            if (role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (role === 'VENDOR') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/search');
            }
        } catch (err) {
            console.error("Login Error:", err);
            const msg = err.response?.data?.message || err.message || 'Failed to login. Check credentials.';

            if (msg.includes("REJECTED")) {
                navigate('/account-rejected');
                return;
            }

            // If it was a role mismatch, we should probably logout to clear the token we just got
            // But since 'login' sets the state, we might need to manually clear it if we throw an error after login.
            // Let's rely on the user trying again or the session being overwritten. 
            // Better: call logout if we detected a mismatch.

            setError(msg);
            // Ensure any partial session is cleared if we threw an error (like role mismatch)
            logout();
        }
    };

    const getTitle = () => {
        switch (loginRole) {
            case 'ADMIN': return 'Admin Login';
            case 'VENDOR': return 'Vendor Login';
            default: return 'User Login';
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card style={{ width: '400px' }} className="shadow border-0">
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4 fw-bold text-primary">{getTitle()}</h2>

                    {/* Role Tabs */}
                    {/* Role Tabs */}
                    <div className="d-flex justify-content-center mb-4 bg-light rounded p-1">
                        <Button
                            type="button"
                            variant={loginRole === 'USER' ? 'white shadow-sm' : 'light'}
                            className={`flex-grow-1 small ${loginRole === 'USER' ? 'fw-bold text-primary' : 'text-muted'}`}
                            onClick={() => { setLoginRole('USER'); setError(''); }}
                            style={{ borderRadius: '4px' }}
                        >
                            User
                        </Button>
                        <Button
                            type="button"
                            variant={loginRole === 'VENDOR' ? 'white shadow-sm' : 'light'}
                            className={`flex-grow-1 small ${loginRole === 'VENDOR' ? 'fw-bold text-success' : 'text-muted'}`}
                            onClick={() => { setLoginRole('VENDOR'); setError(''); }}
                            style={{ borderRadius: '4px' }}
                        >
                            Vendor
                        </Button>
                        <Button
                            type="button"
                            variant={loginRole === 'ADMIN' ? 'white shadow-sm' : 'light'}
                            className={`flex-grow-1 small ${loginRole === 'ADMIN' ? 'fw-bold text-danger' : 'text-muted'}`}
                            onClick={() => { setLoginRole('ADMIN'); setError(''); }}
                            style={{ borderRadius: '4px' }}
                        >
                            Admin
                        </Button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
                        </Form.Group>
                        <Form.Group id="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                        </Form.Group>
                        <Button className={`w-100 mb-3`} variant={loginRole === 'VENDOR' ? 'success' : loginRole === 'ADMIN' ? 'danger' : 'primary'} type="submit">
                            Login
                        </Button>


                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
