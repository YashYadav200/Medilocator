import { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [viewMode, setViewMode] = useState('REQUESTS'); // REQUESTS, VENDORS, ADMINS
    const [statusFilter, setStatusFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED
    const [requestType, setRequestType] = useState('VENDOR'); // VENDOR, ADMIN

    // Data states
    const [vendors, setVendors] = useState([]);
    const [admins, setAdmins] = useState([]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (viewMode === 'REQUESTS') {
            if (requestType === 'VENDOR') {
                fetchVendors(statusFilter);
            } else {
                fetchAdminRequests(statusFilter);
            }
        } else if (viewMode === 'VENDORS') {
            fetchVendors('ALL');
        } else if (viewMode === 'ADMINS') {
            fetchAdmins();
        }
    }, [viewMode, statusFilter, requestType]);

    const fetchVendors = async (status) => {
        try {
            const params = {};
            if (status !== 'ALL') params.status = status;

            const res = await api.get('/admin/vendors', { params });
            setVendors(res.data);
        } catch (err) {
            setError('Failed to fetch vendors');
        }
    };

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/admin/admins');
            setAdmins(res.data);
        } catch (err) {
            setError('Failed to fetch admins');
        }
    };

    const fetchAdminRequests = async (status) => {
        try {
            const params = {};
            if (status !== 'ALL') params.status = status;
            const res = await api.get('/admin/admins', { params });
            setAdmins(res.data);
        } catch (err) {
            setError('Failed to fetch admin requests');
        }
    };

    const handleVerify = async (id) => {
        try {
            await api.post(`/admin/verify/${id}`);
            setSuccess('Vendor approved successfully');
            fetchVendors(statusFilter);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to verify vendor');
        }
    };

    const handleReject = async (id) => {
        try {
            await api.post(`/admin/reject/${id}`);
            setSuccess('Vendor rejected');
            fetchVendors(statusFilter);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to reject vendor');
        }
    };

    const handleVerifyAdmin = async (id) => {
        try {
            await api.post(`/admin/verify-admin/${id}`);
            setSuccess('Admin approved successfully');
            fetchAdminRequests(statusFilter);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to verify admin');
        }
    };

    const handleRejectAdmin = async (id) => {
        try {
            await api.post(`/admin/reject-admin/${id}`);
            setSuccess('Admin rejected');
            fetchAdminRequests(statusFilter);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to reject admin');
        }
    };

    return (
        <Container className="mt-4">
            <h2>Admin Dashboard</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* Main Navigation Tabs */}
            <div className="d-flex mb-4 border-bottom">
                <h5
                    className={`me-4 pb-2 pointer cursor-pointer ${viewMode === 'REQUESTS' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setViewMode('REQUESTS')}
                >
                    Requests
                </h5>
                <h5
                    className={`me-4 pb-2 pointer cursor-pointer ${viewMode === 'VENDORS' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setViewMode('VENDORS')}
                >
                    Vendors
                </h5>
                <h5
                    className={`pb-2 pointer cursor-pointer ${viewMode === 'ADMINS' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setViewMode('ADMINS')}
                >
                    Admins
                </h5>
            </div>

            {/* Sub-filters for Verification Requests */}
            {viewMode === 'REQUESTS' && (
                <div className="mb-3">
                    <div className="btn-group mb-3">
                        <Button
                            variant={requestType === 'VENDOR' ? 'dark' : 'outline-dark'}
                            onClick={() => setRequestType('VENDOR')}
                        >
                            Vendor Requests
                        </Button>
                        <Button
                            variant={requestType === 'ADMIN' ? 'dark' : 'outline-dark'}
                            onClick={() => setRequestType('ADMIN')}
                        >
                            Admin Requests
                        </Button>
                    </div>

                    <div className="d-flex mb-3">
                        <Button
                            variant={statusFilter === 'PENDING' ? 'primary' : 'outline-primary'}
                            className="me-2"
                            onClick={() => setStatusFilter('PENDING')}
                        >
                            Pending
                        </Button>
                        <Button
                            variant={statusFilter === 'APPROVED' ? 'success' : 'outline-success'}
                            className="me-2"
                            onClick={() => setStatusFilter('APPROVED')}
                        >
                            Approved
                        </Button>
                        <Button
                            variant={statusFilter === 'REJECTED' ? 'danger' : 'outline-danger'}
                            onClick={() => setStatusFilter('REJECTED')}
                        >
                            Rejected
                        </Button>
                    </div>
                </div>
            )}

            {/* Header Title */}
            <h4 className="mb-3">
                {viewMode === 'REQUESTS' && `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} ${requestType === 'VENDOR' ? 'Vendor' : 'Admin'} Requests`}
                {viewMode === 'VENDORS' && 'All Registered Vendors'}
                {viewMode === 'ADMINS' && 'All Administrators'}
            </h4>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        {viewMode === 'ADMINS' ? (
                            <>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined Date</th>
                                <th>Status</th>
                            </>
                        ) : (
                            viewMode === 'REQUESTS' && requestType === 'ADMIN' ? (
                                <>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Registered Date</th>
                                    <th>Status</th>
                                    {statusFilter === 'PENDING' && <th>Actions</th>}
                                </>
                            ) : (
                                <>
                                    <th>Store Name</th>
                                    <th>Owner</th>
                                    <th>Location</th>
                                    <th>Registered Date</th>
                                    <th>Status</th>
                                    {viewMode === 'REQUESTS' && statusFilter === 'PENDING' && <th>Actions</th>}
                                </>
                            )
                        )}
                    </tr>
                </thead>
                <tbody>
                    {/* ALL ADMINS VIEW (Simple List) */}
                    {viewMode === 'ADMINS' && (
                        admins.length === 0 ? (
                            <tr><td colSpan="3" className="text-center">No admins found</td></tr>
                        ) : (
                            admins.map(admin => (
                                <tr key={admin._id}>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge bg-${admin.status === 'APPROVED' ? 'success' : admin.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                                            {admin.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )
                    )}

                    {/* ADMIN REQUESTS VIEW */}
                    {viewMode === 'REQUESTS' && requestType === 'ADMIN' && (
                        admins.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No {statusFilter.toLowerCase()} admin requests found</td></tr>
                        ) : (
                            admins.map(admin => (
                                <tr key={admin._id}>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.role}</td>
                                    <td>{new Date(admin.createdAt).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge bg-${admin.status === 'APPROVED' ? 'success' : admin.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                                            {admin.status}
                                        </span>
                                    </td>
                                    {statusFilter === 'PENDING' && (
                                        <td>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleVerifyAdmin(admin._id)}>Accept</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleRejectAdmin(admin._id)}>Reject</Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )
                    )}

                    {/* VENDOR REQUESTS & ALL VENDORS VIEW */}
                    {(viewMode !== 'ADMINS' && !(viewMode === 'REQUESTS' && requestType === 'ADMIN')) && (
                        vendors.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No vendors found</td></tr>
                        ) : (
                            vendors.map(vendor => (
                                <tr key={vendor._id}>
                                    <td>{vendor.storeName}</td>
                                    <td>{vendor.userId?.name} ({vendor.userId?.email})</td>
                                    <td>{vendor.area}, {vendor.district}, {vendor.state}</td>
                                    <td>{new Date(vendor.createdAt).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge bg-${vendor.status === 'APPROVED' ? 'success' : vendor.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    {viewMode === 'REQUESTS' && statusFilter === 'PENDING' && (
                                        <td>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleVerify(vendor._id)}>Accept</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleReject(vendor._id)}>Reject</Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminDashboard;
