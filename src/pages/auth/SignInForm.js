import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Link, useHistory } from 'react-router-dom';
import styles from '../../styles/SignInUpForm.module.css';
import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';
import { useRedirect } from '../../hooks/useRedirect';
import VideoPlayerSignIn from '../../components/Video/VideoPlayerSignIn';
import { toast } from 'react-toastify';
import { setTokenTimestamp } from '../../utils/utils';
import { useRedirectAfterLogin } from '../../hooks/useRedirectAfterLogin';

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  useRedirect('loggedIn');
  const getRedirectUrl = useRedirectAfterLogin();

  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const hasChanges = Object.values(signInData).some((value) => value !== '');
    setIsChanged(hasChanges);
  }, [signInData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post('/dj-rest-auth/login/', signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      toast.success('Successfully signed in!');
      const redirectUrl = getRedirectUrl();
      history.push(redirectUrl);
    } catch (err) {
      setErrors(err.response?.data);
      toast.error('Sign in failed. Please check your credentials.');
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto p-0 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4`}>
          <h1 className={styles.Header}>
            Welcome back to our diving community!
          </h1>
          <p className={styles.SubHeader}>
            Sign in to access your account, connect with fellow divers, and
            continue your underwater adventures. Your next diving experience is
            just a login away!
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                className={styles.Input}
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                className={styles.Input}
                value={password}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password?.map((message, idx) => (
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
              Sign in
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don&apos;t have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
      >
        <VideoPlayerSignIn publicId="ke9x3yszhi9wucopgon2" />
      </Col>
    </Row>
  );
}

export default SignInForm;
