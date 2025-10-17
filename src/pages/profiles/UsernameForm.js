import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { axiosRes } from '../../api/axiosDefaults';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';
import UpdateConfirmationModal from '../../components/UpdateConfirmationModal';

const UsernameForm = () => {
  const [username, setUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);

  const history = useHistory();
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
      setOriginalUsername(currentUser.username);
    } else {
      history.push('/');
      toast.error("You don't have permission to edit this profile.");
    }
  }, [currentUser, history, id]);

  useEffect(() => {
    setIsChanged(username !== originalUsername);
  }, [username, originalUsername]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowUpdateConfirmation(true);
  };

  const confirmSubmit = async () => {
    try {
      await axiosRes.put('/dj-rest-auth/user/', {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      toast.success('Username updated successfully!');
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
      toast.error('Failed to update username. Please try again.');
    }
    setShowUpdateConfirmation(false);
  };

  const handleCancel = () => {
    history.goBack();
    toast.info('Username change cancelled.');
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Red}`}
              onClick={handleCancel}
            >
              cancel
            </Button>
            <Button
              className={`${btnStyles.Button} ${isChanged ? btnStyles.Blue : btnStyles.Gray}`}
              type="submit"
              disabled={!isChanged}
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
      <UpdateConfirmationModal
        show={showUpdateConfirmation}
        handleClose={() => setShowUpdateConfirmation(false)}
        handleConfirm={confirmSubmit}
      />
    </Row>
  );
};

export default UsernameForm;
