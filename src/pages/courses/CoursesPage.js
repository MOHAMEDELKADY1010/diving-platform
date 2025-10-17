import React, { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Link, useHistory } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import styles from '../../styles/CoursesPage.module.css';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const stripHtmlTags = (html) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const CourseBox = ({ title, imageUrl, excerpt, slug, price, currentUser }) => {
  const history = useHistory();

  const handleBookNowClick = useCallback(
    (e) => {
      e.preventDefault();
      if (currentUser) {
        history.push('/bookings/create');
      } else {
        toast.warning('Please sign in to book a course.');
        const currentLocation = history.location.pathname;
        history.push(`/signin?next=${encodeURIComponent(currentLocation)}`);
      }
    },
    [currentUser, history]
  );

  const cleanExcerpt = stripHtmlTags(excerpt);

  return (
    <div className={styles.courseBox}>
      <h2>{title}</h2>
      <Row>
        <Col xs={12} md={4}>
          {imageUrl ? (
            <img
              src={imageUrl}
              className={styles.courseImage}
              alt={title}
              onError={(e) => {
                e.target.src = '../images/courses/4.webp';
              }}
            />
          ) : (
            <div className={styles.PlaceholderImage}>No Image Available</div>
          )}
        </Col>
        <Col xs={12} md={8}>
          <p className={styles.courseDescription}>{cleanExcerpt}</p>
          <p className={styles.PriceDisplay}>Price: {price}</p>
          <div className={styles.buttonContainer}>
            <Button onClick={handleBookNowClick} className={styles.bookButton}>
              {currentUser ? 'Book Now' : 'Sign In to Book'}
            </Button>
            <Link to={`/courses/${slug}`} className={styles.homeButton}>
              Learn More
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const CoursesPage = () => {
  const currentUser = useCurrentUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        const response = await axiosReq.get('/courses/');

        if (isMounted) {
          if (response.status === 200) {
            if (Array.isArray(response.data)) {
              setCourses(response.data);
            } else if (
              response.data.results &&
              Array.isArray(response.data.results)
            ) {
              setCourses(response.data.results);
            } else {
              setError('Unexpected data structure in API response');
              toast.error('Error loading courses. Please try again later.');
            }
          } else {
            setError('Unexpected API response status');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load courses');
          toast.error(
            'Failed to load courses. Please check your internet connection and try again.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Container className={styles.coursesPage}>
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={styles.coursesPage}>
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className={styles.coursesPage}>
      <h1 className={styles.courseTitle}>Our Diving Courses</h1>
      {courses && courses.length > 0 ? (
        courses.map((course) => (
          <CourseBox
            key={course.id}
            title={course.title}
            imageUrl={course.image}
            excerpt={course.excerpt}
            slug={course.slug}
            price={course.price_display || `${course.price} $`}
            currentUser={currentUser}
          />
        ))
      ) : (
        <Alert variant="info">No courses available at the moment.</Alert>
      )}
    </Container>
  );
};

export default CoursesPage;
