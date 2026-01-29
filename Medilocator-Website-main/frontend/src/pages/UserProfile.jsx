import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../api/axios';

const UserProfile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Failed to load profile' });
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });

        if (password || confirmPassword) {
            if (password !== confirmPassword) {
                setMessage({ type: 'danger', text: 'Passwords do not match!' });
                setUpdating(false);
                return;
            }
            if (password.length < 6) {
                setMessage({ type: 'danger', text: 'Password must be at least 6 characters.' });
                setUpdating(false);
                return;
            }
        }

        try {
            const payload = {
                name: user.name,
                fullName: user.name, // Sync User.name with Vendor.fullName
                email: user.email,
                pincode: user.pincode,
                storeName: user.storeName,
                mobile: user.mobile,
                address: user.address,
                state: user.state,
                district: user.district,
                area: user.area,
                areaCode: user.areaCode,
                storeTimings: user.storeTimings,
                password: password || undefined // Only send if set
            };

            const res = await api.put('/auth/profile', payload);
            setUser(res.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <Card className="shadow border-0 rounded-4">
                        <Card.Header className="bg-primary text-white text-center py-3 rounded-top-4">
                            <h3 className="mb-0 fw-bold">My Profile</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {message.text && (
                                <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                                    {message.text}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        required
                                        className="bg-light"
                                    />
                                </Form.Group>



                                {user.role !== 'VENDOR' && (
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">Pincode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pincode"
                                            value={user.pincode || ''}
                                            onChange={handleChange}
                                            placeholder="Enter your area pincode"
                                            maxLength="6"
                                        />
                                    </Form.Group>
                                )}

                                <hr className="my-4" />
                                <h5 className="mb-3 text-secondary">Change Password</h5>

                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="New Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <hr className="my-4" />

                                {user.role === 'VENDOR' && (
                                    <>
                                        <h5 className="mb-3 text-secondary mt-4 border-bottom pb-2">Medical Store Details</h5>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">Store Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="storeName"
                                                        value={user.storeName || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">Mobile Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="mobile"
                                                        value={user.mobile || ''}
                                                        onChange={handleChange}
                                                        required
                                                        maxLength="10"
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Store Address</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="address"
                                                value={user.address || ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">State</Form.Label>
                                                    <Form.Select
                                                        name="state"
                                                        value={user.state || ''}
                                                        onChange={handleChange}
                                                        required
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
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">District</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="district"
                                                        value={user.district || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">Area</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="area"
                                                        value={user.area || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">Area Code (Pincode)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="areaCode"
                                                        value={user.areaCode || ''}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">Store Timings</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="storeTimings"
                                                value={user.storeTimings || ''}
                                                onChange={handleChange}
                                                placeholder="e.g., 9:00 AM - 9:00 PM"
                                                required
                                            />
                                        </Form.Group>
                                    </>
                                )}

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" size="lg" disabled={updating}>
                                        {updating ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    {user.role !== 'VENDOR' && user.role !== 'ADMIN' && (
                                        <Button variant="outline-secondary" href="/search">
                                            Back to Search
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
};

export default UserProfile;
