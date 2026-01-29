import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Card, Row, Col } from 'react-bootstrap';
import api from '../../api/axios';

const VendorDashboard = () => {
    const [medicines, setMedicines] = useState([]);
    const [hasProfile, setHasProfile] = useState(true); // Assume true initially
    const [profileData, setProfileData] = useState({
        storeName: '', fullName: '', email: '', mobile: '', address: '', state: '', district: '', area: '', areaCode: '', storeTimings: ''
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMedicine, setNewMedicine] = useState({ name: '', quantity: '', price: '' });
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/vendor/my-medicines');
            setMedicines(res.data);
            setHasProfile(true);
        } catch (err) {
            if (err.response && err.response.data.message === "Vendor profile not found") {
                setHasProfile(false);
            } else {
                setError("Failed to fetch medicines");
            }
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            await api.post('/vendor/create-profile', profileData);
            setHasProfile(true);
            fetchMedicines();
        } catch (err) {
            setError("Failed to create profile");
        }
    };

    const handleAddMedicine = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vendor/add-medicine', newMedicine);
            setShowAddModal(false);
            fetchMedicines();
            setNewMedicine({ name: '', quantity: '', price: '' });
        } catch (err) {
            setError("Failed to add medicine");
        }
    };

    const handleEditClick = (med) => {
        setEditingMedicine(med);
        setShowEditModal(true);
    };

    const handleUpdateMedicine = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/vendor/update-medicine/${editingMedicine._id}`, editingMedicine);
            setShowEditModal(false);
            setEditingMedicine(null);
            fetchMedicines();
        } catch (err) {
            setError("Failed to update medicine");
        }
    };

    const handleDeleteMedicine = async (id) => {
        if (!window.confirm("Are you sure you want to delete this medicine?")) return;

        try {
            console.log(`Sending DELETE request for ID: ${id}`);
            await api.delete(`/vendor/delete-medicine/${id}`);
            console.log("Delete success!");
            fetchMedicines();
        } catch (err) {
            console.error("FULL DELETE ERROR:", err);
            if (err.message === "Network Error") {
                setError("Network Error: Cannot reach server. Check if backend is running.");
            } else {
                setError(err.response?.data?.message || "Failed to delete medicine");
            }
        }
    };



    // Changing strategy: I will replace the function and the table in two separate calls or use multi_replace


    if (!hasProfile) {
        return (
            <Container className="mt-4">
                <h2>Complete Your Vendor Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Card className="p-4">
                    <Form onSubmit={handleProfileSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" required placeholder="Owner Name" onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Store Name</Form.Label>
                                    <Form.Control type="text" required placeholder="Medical Store Name" onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="10-digit Mobile"
                                        value={profileData.mobile}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val) && val.length <= 10) {
                                                setProfileData({ ...profileData, mobile: val });
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" required placeholder="Store Email" onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control as="textarea" rows={2} required placeholder="Full Store Address" onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control type="text" required placeholder="State" onChange={(e) => setProfileData({ ...profileData, state: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>District</Form.Label>
                                    <Form.Control type="text" required placeholder="District" onChange={(e) => setProfileData({ ...profileData, district: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Area</Form.Label>
                                    <Form.Control type="text" required placeholder="Locality/Area" onChange={(e) => setProfileData({ ...profileData, area: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Area Code (Pincode)</Form.Label>
                                    <Form.Control type="text" required placeholder="Pincode" onChange={(e) => setProfileData({ ...profileData, areaCode: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Store Timings (Opening - Closing)</Form.Label>
                            <Form.Control type="text" required placeholder="e.g. 09:00 AM - 10:00 PM" onChange={(e) => setProfileData({ ...profileData, storeTimings: e.target.value })} />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100 mt-2">Create Profile</Button>
                    </Form>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Medicines</h2>
                <Button onClick={() => setShowAddModal(true)}>Add Medicine</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {medicines.map(med => (
                        <tr key={med._id}>
                            <td>{med.name}</td>
                            <td>{med.quantity}</td>
                            <td>{med.price}</td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(med)}>Edit</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMedicine(med._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Medicine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddMedicine}>
                        <Form.Group className="mb-3">
                            <Form.Label>Medicine Name</Form.Label>
                            <Form.Control type="text" required value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" min="0" required value={newMedicine.quantity} onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" required value={newMedicine.price} onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })} />
                        </Form.Group>
                        <Button type="submit">Add</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Medicine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingMedicine && (
                        <Form onSubmit={handleUpdateMedicine}>
                            <Form.Group className="mb-3">
                                <Form.Label>Medicine Name</Form.Label>
                                <Form.Control type="text" required value={editingMedicine.name} onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type="number" min="0" required value={editingMedicine.quantity} onChange={(e) => setEditingMedicine({ ...editingMedicine, quantity: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" required value={editingMedicine.price} onChange={(e) => setEditingMedicine({ ...editingMedicine, price: e.target.value })} />
                            </Form.Group>
                            <Button type="submit" variant="primary">Update Medicine</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default VendorDashboard;
