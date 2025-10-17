import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';
import styles from '../../styles/ContactForm.module.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // استبدل القيم هنا ببياناتك من EmailJS
    const serviceID = 'service_9g9wbsd';
    const templateID = 'template_8tq16gd';
    const publicKey = 'ypD2I16pRRvYOUg_1';

    emailjs
      .send(
        serviceID,
        templateID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        publicKey
      )
      .then(() => {
        toast.success('✅ تم إرسال الرسالة بنجاح!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch(() => {
        toast.error('❌ حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.');
      });
  };

  return (
    <div className={styles.ContactForm}>
      <h2 className={styles.Title}>Contact Us</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name*</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email*</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="subject">
          <Form.Label>Subject*</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="message">
          <Form.Label>Message*</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="message"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className={styles.buttonContainer}>
          <Button
            type="submit"
            className={styles.SubmitButton}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.subject ||
              !formData.message
            }
          >
            Send Message
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ContactForm;
