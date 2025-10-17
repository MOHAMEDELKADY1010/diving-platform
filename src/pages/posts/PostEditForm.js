import React, { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import styles from '../../styles/PostCreateEditForm.module.css';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';
import { useHistory, useParams } from 'react-router';
import { axiosReq } from '../../api/axiosDefaults';
import UpdateConfirmationModal from '../../components/UpdateConfirmationModal';

function PostEditForm() {
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    image: '',
  });

  const [originalPostData, setOriginalPostData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { title, content, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();
  const isMounted = useRef(true);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const { title, content, image, is_owner } = data;

        if (is_owner) {
          setPostData({ title, content, image });
          setOriginalPostData({ title, content, image });
        } else {
          history.push('/');
        }
      } catch (err) {
        console.error('Error fetching post data:', err);
        toast.error('Failed to load post data.');
      }
    };

    handleMount();

    return () => {
      isMounted.current = false;
    };
  }, [history, id]);

  useEffect(() => {
    setIsChanged(
      title !== originalPostData.title ||
        content !== originalPostData.content ||
        image !== originalPostData.image
    );
  }, [title, content, image, originalPostData]);

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      const newImageUrl = URL.createObjectURL(event.target.files[0]);
      if (image) {
        URL.revokeObjectURL(image);
      }
      setPostData({
        ...postData,
        image: newImageUrl,
      });
      toast.info('Image selected. Remember to save your changes!');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isChanged) {
      setShowUpdateModal(true);
    }
  };

  const handleConfirmUpdate = useCallback(async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (imageInput.current?.files[0]) {
      formData.append('image', imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/posts/${id}/`, formData);
      if (isMounted.current) {
        toast.success('Post updated successfully!');
        history.push(`/posts/${id}`);
      }
    } catch (err) {
      if (isMounted.current) {
        if (err.response?.status !== 401) {
          setErrors(err.response?.data || {});
          toast.error('Failed to update post. Please check your inputs.');
        }
      }
    }
    if (isMounted.current) {
      setShowUpdateModal(false);
    }
  }, [history, id, title, content]);

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          value={content}
          onChange={handleChange}
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
          toast.info('Edit cancelled');
        }}
      >
        Cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${isChanged ? btnStyles.Blue : btnStyles.Gray}`}
        type="submit"
        disabled={!isChanged}
      >
        Save
      </Button>
    </div>
  );

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
            <Container
              className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
            >
              <Form.Group className="text-center">
                <figure>
                  <Image className={appStyles.Image} src={image} rounded />
                </figure>
                <div>
                  <Form.Label
                    className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                    htmlFor="image-upload"
                  >
                    Change the image
                  </Form.Label>
                </div>

                <Form.File
                  id="image-upload"
                  accept="image/*"
                  onChange={handleChangeImage}
                  ref={imageInput}
                />
              </Form.Group>
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              <div className="d-md-none">{textFields}</div>
            </Container>
          </Col>
          <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
            <Container className={appStyles.Content}>{textFields}</Container>
          </Col>
        </Row>
      </Form>
      <UpdateConfirmationModal
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        handleConfirm={handleConfirmUpdate}
      />
    </>
  );
}

export default PostEditForm;
