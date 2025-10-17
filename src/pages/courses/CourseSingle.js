import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Button, Form, Alert, Spinner } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import styles from '../../styles/CourseSingle.module.css';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import UpdateConfirmationModal from '../../components/UpdateConfirmationModal';

function CourseSingle() {
  const { slug } = useParams();
  const history = useHistory();
  const currentUser = useCurrentUser();
  const [course, setCourse] = useState(null);
  const [review, setReview] = useState({ content: '', rating: 0 });
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const reviewsHeadlineRef = useRef(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axiosReq.get(`/courses/${slug}/`);
        setCourse(data);
        if (currentUser && data.reviews) {
          const userReview = data.reviews.find(
            (review) => review.user === currentUser.username
          );
          if (userReview) {
            setUserReview(userReview);
            setReview({
              content: userReview.content,
              rating: userReview.rating,
            });
          }
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load course data');
        toast.error('Failed to load course data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug, currentUser]);

  const handleSubmitReview = (event) => {
    event.preventDefault();
    if (review.rating === 0) {
      toast.error('Please select a star rating before submitting your review.');
      return;
    }
    if (isEditing) {
      setShowUpdateConfirmation(true);
    } else {
      submitReview();
    }
  };

  const submitReview = async () => {
    try {
      let data;
      if (isEditing) {
        const response = await axiosRes.put(`/reviews/${userReview.id}/`, {
          content: review.content,
          rating: review.rating,
          course: course.id,
        });
        data = response.data;
        setUserReview(data);
        toast.success('Review updated successfully!');
      } else {
        const response = await axiosRes.post('/reviews/', {
          content: review.content,
          rating: review.rating,
          course: course.id,
        });
        data = response.data;
        setUserReview(data);
        toast.success('Review submitted successfully!');
      }
      setCourse((prevCourse) => {
        const updatedReviews = isEditing
          ? prevCourse.reviews.map((rev) => (rev.id === data.id ? data : rev))
          : [data, ...(prevCourse.reviews || [])];
        return {
          ...prevCourse,
          reviews: updatedReviews,
          average_rating: calculateAverageRating(updatedReviews),
        };
      });
      setReview({ content: '', rating: 0 });
      setShowReviewForm(false);
      setIsEditing(false);
      setShowUpdateConfirmation(false);
      setHasChanges(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review');
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axiosRes.delete(`/reviews/${userReview.id}/`);
      setCourse((prevCourse) => ({
        ...prevCourse,
        reviews: prevCourse.reviews.filter(
          (review) => review.id !== userReview.id
        ),
      }));
      setUserReview(null);
      setReview({ content: '', rating: 0 });
      setShowDeleteConfirmation(false);
      toast.success('Review deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete review');
      toast.error('Failed to delete review. Please try again.');
    }
  };

  const handleAddReview = () => {
    if (!currentUser) {
      toast.warning('Please sign in to add a review.');
      const currentLocation = history.location.pathname;
      history.push(`/signin?next=${encodeURIComponent(currentLocation)}`);
    } else {
      setIsEditing(false);
      setReview({ content: '', rating: 0 });
      setShowReviewForm(true);
    }
  };

  const handleEditReview = (reviewContent, reviewRating) => {
    setReview({ content: reviewContent, rating: reviewRating });
    setIsEditing(true);
    setShowReviewForm(true);
    if (reviewsHeadlineRef.current) {
      reviewsHeadlineRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => {
      const updatedReview = { ...prevReview, [name]: value };
      setHasChanges(
        updatedReview.content !== userReview?.content ||
          updatedReview.rating !== userReview?.rating
      );
      return updatedReview;
    });
  };

  const handleRatingChange = (newRating) => {
    setReview((prevReview) => {
      const updatedReview = { ...prevReview, rating: newRating };
      setHasChanges(
        updatedReview.content !== userReview?.content ||
          updatedReview.rating !== userReview?.rating
      );
      return updatedReview;
    });
  };

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <Container>
      {course && (
        <>
          <h1>{course.title}</h1>
          <div className={styles.RatingBookingContainer}>
            <div className={styles.RatingContainer}>
              <p>Average Rating:</p>
              <StarRatings
                rating={course.average_rating || 0}
                starRatedColor="#c7ae6a"
                numberOfStars={5}
                name="courseRating"
                starDimension="20px"
                starSpacing="2px"
              />
            </div>
            <div className={styles.BookingPriceContainer}>
              <Button
                onClick={() => {
                  if (!currentUser) {
                    toast.warning('Please sign in to book this course.');
                    const currentLocation = history.location.pathname;
                    history.push(
                      `/signin?next=${encodeURIComponent(currentLocation)}`
                    );
                  } else {
                    history.push('/bookings/create');
                  }
                }}
                className={`${styles.Button} ${styles.Blue}`}
              >
                {currentUser ? 'Book This Course' : 'Sign In to Book'}
              </Button>
              <span className={styles.PriceDisplay}>
                Price: {course.price_display || `${course.price}`}
              </span>
            </div>
          </div>
          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              className={styles.CourseImage}
            />
          )}
          <div
            className={styles.CourseDescription}
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          <p className={styles.CourseType}>Course Type: {course.course_type}</p>

          <div className={styles.ReviewSection}>
            <h2 ref={reviewsHeadlineRef}>Reviews</h2>
            {!userReview && !showReviewForm && (
              <Button
                onClick={handleAddReview}
                className={`${styles.ReviewButton} ${styles.Blue}`}
              >
                {currentUser ? 'Add Review' : 'Sign In to Review'}
              </Button>
            )}
            {(showReviewForm || isEditing) && (
              <div>
                <Form onSubmit={handleSubmitReview}>
                  <Form.Group>
                    <Form.Label>Your Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="content"
                      value={review.content}
                      onChange={handleReviewChange}
                      required
                    />
                  </Form.Group>
                  <div className={styles.RatingContainer}>
                    <Form.Label
                      style={{ marginRight: '10px', fontSize: '20px' }}
                    >
                      Your Rating
                    </Form.Label>
                    <StarRatings
                      rating={review.rating}
                      starRatedColor="#c7ae6a"
                      changeRating={handleRatingChange}
                      numberOfStars={5}
                      name="rating"
                      starDimension="30px"
                      starSpacing="5px"
                    />
                  </div>
                  <div className={styles.ButtonContainer}>
                    <Button
                      type="submit"
                      className={`${styles.Button} ${styles.Blue}`}
                      disabled={!hasChanges}
                    >
                      {isEditing ? 'Update Review' : 'Submit Review'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setShowReviewForm(false);
                        toast.info('Review cancelled.');
                      }}
                      className={`${styles.Button} ${styles.modalCancelButton}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {course.reviews &&
              course.reviews.map((review) => (
                <div key={review.id} className={styles.Review}>
                  <p>{review.content}</p>
                  <StarRatings
                    rating={review.rating}
                    starRatedColor="#c7ae6a"
                    numberOfStars={5}
                    name={`rating-${review.id}`}
                    starDimension="15px"
                    starSpacing="1px"
                  />
                  <p>By: {review.user}</p>
                  {currentUser && currentUser.username === review.user && (
                    <div>
                      <Button
                        onClick={() =>
                          handleEditReview(review.content, review.rating)
                        }
                        className={`${styles.Button} ${styles.Blue}`}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => setShowDeleteConfirmation(true)}
                        className={`${styles.Button} ${styles.modalDeleteButton}`}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        handleClose={() => setShowDeleteConfirmation(false)}
        handleConfirm={handleDeleteReview}
      />
      <UpdateConfirmationModal
        show={showUpdateConfirmation}
        handleClose={() => setShowUpdateConfirmation(false)}
        handleConfirm={submitReview}
      />
    </Container>
  );
}

export default CourseSingle;
