import { useState } from 'react';
import { Container, Form, Button, Table, Card, Row, Col, Alert } from 'react-bootstrap';
import api from '../api/axios';

const Home = () => {
    const [search, setSearch] = useState({ state: '', district: '', area: '', medicine: '' });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    // Suggestion State
    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState('');

    const INDIAN_STATES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal"
    ];

    const handleFocus = (field) => {
        setActiveField(field);
        if (field === 'state') {
            setSuggestions(INDIAN_STATES);
        } else {
            setSuggestions([]);
        }
    };

    const handleInputChange = async (field, value) => {
        setSearch({ ...search, [field]: value });
        setActiveField(field);

        if (field === 'state') {
            // Filter static list
            if (!value) {
                setSuggestions(INDIAN_STATES);
            } else {
                const filtered = INDIAN_STATES.filter(s => s.toLowerCase().includes(value.toLowerCase()));
                setSuggestions(filtered);
            }
            return;
        }

        // Dynamic API suggestions for other fields
        if (value.length > 1) {
            try {
                const res = await api.get('/search/suggestions', { params: { type: field, query: value } });
                setSuggestions(res.data);
            } catch (err) {
                console.error("Suggestion Error", err);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (value) => {
        setSearch({ ...search, [activeField]: value });
        setSuggestions([]);
        setActiveField('');
    };

    const handleBlur = () => {
        setTimeout(() => {
            setSuggestions([]);
            setActiveField('');
        }, 200);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSearched(true);
        try {
            const res = await api.get('/search/medicine', { params: search });
            if (res.data.message) { // "Medicine not available" or other messages
                setResults([]);
                setError(res.data.message);
            } else {
                setResults(res.data);
            }
        } catch (err) {
            console.error("Search error:", err);
            setError(err.response?.data?.message || "Search failed");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            {/* Hero Section */}
            <div className="text-center py-5 text-white" style={{ background: "linear-gradient(to right, #4facfe, #00f2fe)", paddingBottom: "6rem" }}>
                <Container>
                    <h1 className="display-4 fw-bold mb-3">MediLocator</h1>
                    <p className="lead mb-4">Find Medicines in Your City Quickly and Reliably</p>
                </Container>
            </div>

            {/* Search Section */}
            <Container style={{ marginTop: "-4rem" }}>
                <Card className="p-4 mb-5 shadow-lg border-0 rounded-4">
                    <h4 className="text-center mb-4 text-muted">What are you looking for?</h4>
                    <Form onSubmit={handleSearch}>
                        <Row className="g-3">
                            {['state', 'district', 'area', 'medicine'].map((field) => (
                                <Col md={3} key={field} className="position-relative">
                                    <Form.Group className="text-center">
                                        <Form.Label className="fw-bold small text-muted">{field.toUpperCase()}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="form-control-lg bg-light border-0"
                                            value={search[field]}
                                            onChange={(e) => handleInputChange(field, e.target.value)}
                                            onFocus={() => handleFocus(field)}
                                            onBlur={handleBlur}
                                            autoComplete="off"
                                            style={{ fontSize: "0.95rem" }}
                                        />
                                        {activeField === field && suggestions.length > 0 && (
                                            <ul className="list-group position-absolute w-100 shadow-lg" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                                {suggestions.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="list-group-item list-group-item-action text-start"
                                                        onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(item); }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                        <div className="text-center mt-4">
                            <Button variant="primary" type="submit" size="lg" disabled={loading} className="px-5 rounded-pill shadow-sm fw-bold">
                                {loading ? 'Searching...' : 'Search Medicines'}
                            </Button>
                        </div>
                    </Form>
                </Card>

                {searched && (
                    <div className="animate__animated animate__fadeInUp">
                        {error ? (
                            <Alert variant="danger" className="text-center shadow-sm border-0 rounded-3">
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {error}
                            </Alert>
                        ) : (
                            <div className="mt-4">
                                <h3 className="mb-3 text-secondary">Search Results</h3>
                                <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
                                    <Table hover responsive className="mb-0">
                                        <thead className="bg-light text-secondary">
                                            <tr>
                                                <th className="py-3 ps-4">Medicine Name</th>
                                                <th className="py-3">Store Name</th>
                                                <th className="py-3">Price</th>
                                                <th className="py-3 text-center">Availability</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map(item => (
                                                <>
                                                    <tr
                                                        key={item._id}
                                                        className="align-middle"
                                                        onClick={() => setExpandedRow(expandedRow === item._id ? null : item._id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td className="ps-4 fw-bold text-primary">
                                                            {item.name}
                                                            <i className={`bi bi-chevron-${expandedRow === item._id ? 'up' : 'down'} ms-2 small text-muted`}></i>
                                                        </td>
                                                        <td>
                                                            <span className="d-block text-dark fw-medium">{item.vendorId?.storeName || 'N/A'}</span>
                                                        </td>
                                                        <td className="text-success fw-bold">₹{item.price}</td>
                                                        <td className="text-center">
                                                            <span className={`badge rounded-pill bg-${item.quantity > 10 ? 'success' : item.quantity > 0 ? 'warning' : 'danger'}`}>
                                                                {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                            </span>
                                                            <small className="d-block text-muted mt-1">{item.quantity} units</small>
                                                        </td>
                                                    </tr>
                                                    {expandedRow === item._id && (
                                                        <tr className="bg-light animate__animated animate__fadeIn">
                                                            <td colSpan="4" className="p-4">
                                                                <div className="row">
                                                                    <div className="col-md-6 border-end">
                                                                        <h5 className="text-primary mb-3"><i className="bi bi-shop me-2"></i>Store Details</h5>
                                                                        <p className="mb-1"><strong>Store Name:</strong> {item.vendorId?.storeName}</p>
                                                                        <p className="mb-1"><strong>Phone:</strong> {item.vendorId?.mobile}</p>
                                                                        <p className="mb-1"><strong>Address:</strong> {item.vendorId?.address}</p>
                                                                        <p className="mb-1"><strong>Area:</strong> {item.vendorId?.area}, {item.vendorId?.district}</p>
                                                                        <p className="mb-0"><strong>State:</strong> {item.vendorId?.state} - {item.vendorId?.areaCode}</p>
                                                                    </div>
                                                                    <div className="col-md-6 ps-md-4">
                                                                        <h5 className="text-success mb-3"><i className="bi bi-capsule me-2"></i>Medicine Details</h5>
                                                                        <p className="mb-1"><strong>Medicine Name:</strong> {item.name}</p>
                                                                        <p className="mb-1"><strong>Price:</strong> ₹{item.price}</p>
                                                                        <p className="mb-1">
                                                                            <strong>Status: </strong>
                                                                            <span className={`text-${item.quantity > 0 ? 'success' : 'danger'} fw-bold`}>
                                                                                {item.quantity > 0 ? 'Available' : 'Unavailable'}
                                                                            </span>
                                                                        </p>
                                                                        <p className="mb-0"><strong>Stock Quantity:</strong> {item.quantity}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Home;
