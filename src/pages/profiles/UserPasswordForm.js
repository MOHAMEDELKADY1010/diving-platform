import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { axiosRes } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import UpdateConfirmationModal from '../../components/UpdateConfirmationModal';

import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';

const UserPasswordForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: '',
    new_password2: '',
  });
  const { new_password1, new_password2 } = userData;

  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsChanged(
      value.trim() !== '' ||
        (name === 'new_password1' ? new_password2 : new_password1).trim() !== ''
    );
  };

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      history.push('/');
      toast.error("You don't have permission to access this page.");
    }
  }, [currentUser, history, id]);

  const validatePasswords = () => {
    const errors = {};
    if (new_password1 !== new_password2) {
      errors.new_password2 = ['Passwords do not match.'];
    }
    if (new_password1.length < 8) {
      errors.new_password1 = ['Password must be at least 8 characters long.'];
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validatePasswords()) {
      setShowModal(true);
    } else {
      toast.error('Please correct the errors before proceeding.');
    }
  };

  const handleConfirm = async () => {
    try {
      await axiosRes.post('/dj-rest-auth/password/change/', userData);
      toast.success('Password changed successfully!');
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
      toast.error(
        'Failed to change password. Please check the errors and try again.'
      );
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <Row>
        <Col className="py-2 mx-auto text-center" md={6}>
          <Container className={appStyles.Content}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>New password</Form.Label>
                <Form.Control
                  placeholder="new password"
                  type="password"
                  value={new_password1}
                  onChange={handleChange}
                  name="new_password1"
                />
              </Form.Group>
              {errors?.new_password1?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}
              <Form.Group>
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  placeholder="confirm new password"
                  type="password"
                  value={new_password2}
                  onChange={handleChange}
                  name="new_password2"
                />
              </Form.Group>
              {errors?.new_password2?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Red}`}
                onClick={() => {
                  history.goBack();
                  toast.info('Password change cancelled.');
                }}
              >
                cancel
              </Button>
              <Button
                type="submit"
                className={`${btnStyles.Button} ${isChanged ? btnStyles.Blue : btnStyles.Gray}`}
                disabled={!isChanged}
              >
                save
              </Button>
            </Form>
          </Container>
        </Col>
      </Row>

      <UpdateConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirm}
        message="Are you sure you want to change your password?"
      />
    </>
  );
};

export default UserPasswordForm;
