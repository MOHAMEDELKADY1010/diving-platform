import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { axiosReq } from '../../api/axiosDefaults';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';
import { toast } from 'react-toastify';
import UpdateConfirmationModal from '../../components/UpdateConfirmationModal';

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    name: '',
    content: '',
    image: '',
  });
  const { name, content, image } = profileData;

  const [originalProfileData, setOriginalProfileData] = useState({});
  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { name, content, image } = data;
          setProfileData({ name, content, image });
          setOriginalProfileData({ name, content, image });
        } catch (err) {
          toast.error('Failed to load profile. Please try again.');
          history.push('/');
        }
      } else {
        history.push('/');
      }
    };

    handleMount();
  }, [currentUser, history, id]);

  useEffect(() => {
    const hasChanges = Object.keys(profileData).some(
      (key) => profileData[key] !== originalProfileData[key]
    );
    setIsChanged(hasChanges);
  }, [profileData, originalProfileData]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowUpdateConfirmation(true);
  };

  const confirmSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('content', content);

    if (imageFile?.current?.files[0]) {
      formData.append('image', imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      toast.success('Profile updated successfully!');
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
      toast.error('Failed to update profile. Please try again.');
    }
    setShowUpdateConfirmation(false);
  };

  const handleImageChange = (event) => {
    if (event.target.files.length) {
      setProfileData({
        ...profileData,
        image: URL.createObjectURL(event.target.files[0]),
      });
      toast.info("Image selected. Don't forget to save your changes!");
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          value={content}
          onChange={handleChange}
          name="content"
          rows={7}
        />
      </Form.Group>

      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Red}`}
        onClick={() => {
          history.goBack();
          toast.info('Changes discarded.');
        }}
      >
        cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        type="submit"
        disabled={!isChanged}
      >
        save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={appStyles.Content}>
            <Form.Group>
              {image && (
                <figure>
                  <Image src={image} fluid />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.File
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
      <UpdateConfirmationModal
        show={showUpdateConfirmation}
        handleClose={() => setShowUpdateConfirmation(false)}
        handleConfirm={confirmSubmit}
      />
    </Form>
  );
};

export default ProfileEditForm;
