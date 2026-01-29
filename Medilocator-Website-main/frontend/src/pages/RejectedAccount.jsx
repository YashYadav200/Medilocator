import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RejectedAccount = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card className="text-center p-5 shadow-sm border-0" style={{ maxWidth: '500px' }}>
                <div className="mb-4">
                    <span style={{ fontSize: '4rem' }}>🚫</span>
                </div>
                <h2 className="text-danger mb-3">Application Rejected</h2>
                <p className="lead mb-4">
                    We're sorry, but your vendor application has been <strong>REJECTED</strong> by the administrator.
                </p>
                <p className="text-muted mb-4">
                    This decision is final regarding the current application. If you believe this is a mistake or would like more information, please contact our support team.
                </p>
                <div className="d-grid gap-2">
                    <Button as={Link} to="/contact-support" variant="primary" size="lg">
                        Contact Support
                    </Button>
                    <Button as={Link} to="/" variant="outline-secondary">
                        Back to Home
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default RejectedAccount;
