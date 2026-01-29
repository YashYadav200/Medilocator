import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import api from '../api/axios';

const ContactSupport = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await api.post('/support/contact', formData);
            setStatus({ type: 'success', msg: 'Support request sent successfully! We will get back to you soon.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({ type: 'danger', msg: error.response?.data?.message || 'Failed to send message. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="text-center mb-4">Contact Support</h2>
            {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}
            <Card className="p-4 shadow-sm">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your Name"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Your Email"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="Subject"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="How can we help you?"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ContactSupport;
