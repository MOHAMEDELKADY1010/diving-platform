import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from '../../styles/SignInUpForm.module.css';
import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';
import VideoPlayerSignUp from '../../components/Video/VideoPlayerSignUp.js';
import {
  Form,
  Button,
  Col,
  Row,
  Container,
  Alert,
  Spinner,
} from 'react-bootstrap';
import axios from 'axios';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const SignUpForm = () => {
  const history = useHistory();
  const currentUser = useCurrentUser();
  const [signUpData, setSignUpData] = useState({
    username: '',
    password1: '',
    password2: '',
  });
  const { username, password1, password2 } = signUpData;
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (currentUser === null) {
      setIsLoading(false);
    } else if (currentUser) {
      history.push('/');
    }
  }, [currentUser, history]);

  useEffect(() => {
    const hasChanges = Object.values(signUpData).some((value) => value !== '');
    setIsChanged(hasChanges);
  }, [signUpData]);

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/dj-rest-auth/registration/', signUpData);
      toast.success(
        'Sign up successful! Welcome to our diving community! Please Sign In'
      );
      history.push('/signin');
    } catch (err) {
      setErrors(err.response?.data || {});
      toast.error(
        'Sign up failed. Please check your information and try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  if (currentUser) {
    return (
      <Container>
        <p>You are already logged in!</p>
        <Link to="/">Go to home page</Link>
      </Container>
    );
  }

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4`}>
          <h1 className={styles.Header}>Join Our Diving Community</h1>
          <p className={styles.SubHeader}>
            Dive into a world of adventure! Sign up now to connect with fellow
            divers, share your underwater experiences, and discover new diving
            spots. Whether you&apos;re a beginner or an experienced diver,
            there&apos;s a place for you in our community.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password1?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password2">
              <Form.Label className="d-none">Confirm password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password2?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${
                isChanged ? btnStyles.Bright : btnStyles.Gray
              }`}
              type="submit"
              disabled={!isChanged}
            >
              Sign up
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
      >
        <VideoPlayerSignUp publicId="160396821086388" />
      </Col>
    </Row>
  );
};

export default SignUpForm;
