import { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [role, setRole] = useState('USER');
    const [pincode, setPincode] = useState('');

    // Vendor Specific State
    const [vendorData, setVendorData] = useState({
        storeName: '',
        fullName: '',
        mobile: '',
        address: '',
        state: '',
        district: '',
        area: '',
        areaCode: '',
        storeTimings: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            await register(name, email, password, role, vendorData, pincode);
            setSuccess('Registration Successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error("Registration Error:", err);
            const errMsg = err.response?.data?.message || err.message || 'Failed to register. Please check details.';
            setError(errMsg);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "100vh" }}>
            <Card style={{ width: role === 'VENDOR' ? '700px' : '400px', transition: 'width 0.3s' }} className="shadow-lg border-0">
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4 fw-bold text-primary">Join MediLocator</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="mb-3 form-select-lg"
                            >
                                <option value="USER">User</option>
                                <option value="VENDOR">Vendor</option>
                                <option value="ADMIN">Admin</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Common Fields */}
                        <div className="row">
                            <div className={role === 'VENDOR' ? 'col-md-6' : 'col-12'}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" required placeholder="Your Name" onChange={(e) => setName(e.target.value)} />
                                </Form.Group>
                            </div>
                            <div className={role === 'VENDOR' ? 'col-md-6' : 'col-12'}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" required placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                            </div>
                        </div>

                        {role === 'USER' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Pincode</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    placeholder="Enter your Area Pincode"
                                    value={pincode}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val) && val.length <= 6) {
                                            setPincode(val);
                                        }
                                    }}
                                />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required placeholder="Create a strong password" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        {/* Vendor Specific Fields */}
                        {role === 'VENDOR' && (
                            <div className="animate__animated animate__fadeIn">
                                <hr className="my-4" />
                                <h5 className="mb-3 text-secondary">Vendor Details</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Store Name</Form.Label>
                                            <Form.Control type="text" required placeholder="Medical Store Name" onChange={(e) => setVendorData({ ...vendorData, storeName: e.target.value })} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mobile No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                required
                                                placeholder="10-digit number"
                                                value={vendorData.mobile}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (/^\d*$/.test(val) && val.length <= 10) {
                                                        setVendorData({ ...vendorData, mobile: val });
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control as="textarea" rows={2} required placeholder="Full Shop Address" onChange={(e) => setVendorData({ ...vendorData, address: e.target.value })} />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <Form.Group className="mb-3">
                                            <Form.Label>State</Form.Label>
                                            <Form.Select
                                                required
                                                value={vendorData.state}
                                                onChange={(e) => setVendorData({ ...vendorData, state: e.target.value })}
                                            >
                                                <option value="">Select State</option>
                                                {[
                                                    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
                                                    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
                                                    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
                                                    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
                                                    "Uttarakhand", "West Bengal"
                                                ].map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-4">
                                        <Form.Group className="mb-3">
                                            <Form.Label>District</Form.Label>
                                            <Form.Control type="text" required placeholder="District" onChange={(e) => setVendorData({ ...vendorData, district: e.target.value })} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-4">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Area</Form.Label>
                                            <Form.Control type="text" required placeholder="Area" onChange={(e) => setVendorData({ ...vendorData, area: e.target.value })} />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Area Code (Pincode)</Form.Label>
                                            <Form.Control type="text" required placeholder="e.g. 411038" onChange={(e) => setVendorData({ ...vendorData, areaCode: e.target.value })} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Store Timings</Form.Label>
                                            <Form.Control type="text" required placeholder="e.g. 9AM - 10PM" onChange={(e) => setVendorData({ ...vendorData, storeTimings: e.target.value })} />
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button className="w-100 btn-lg mt-3" variant={role === 'VENDOR' ? 'success' : role === 'ADMIN' ? 'danger' : 'primary'} type="submit">
                            {role === 'VENDOR' ? 'Register As Vendor' : role === 'ADMIN' ? 'Register As Admin' : 'Register As User'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container >
    );
};

export default Register;
