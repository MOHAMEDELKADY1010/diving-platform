import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import styles from '../../styles/BookingForm.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { toast } from 'react-toastify';
import Asset from '../../components/Asset';

const BookingForm = () => {
  const history = useHistory();
  const currentUser = useCurrentUser();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    course: '',
    additional_info: '',
  });
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      history.push('/signin');
    }
    return () => setIsMounted(false);
  }, [currentUser, history]);

  const fetchCourses = useCallback(
    async (abortController) => {
      try {
        const { data } = await axiosReq.get('/courses/', {
          signal: abortController.signal,
        });
        if (isMounted) {
          setCourses(data.results || data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        if (err.name === 'AbortError') {
          return;
        }
        if (err.response?.status === 401 && isMounted) {
          toast.error('Your session has expired. Please sign in again.');
          history.push('/signin');
        } else if (isMounted) {
          toast.error('Failed to load courses. Please try again.');
        }
      }
    },
    [history, isMounted]
  );

  useEffect(() => {
    const abortController = new AbortController();
    if (currentUser) {
      fetchCourses(abortController).finally(() => {
        if (isMounted) {
          setHasLoaded(true);
        }
      });
    }
    return () => {
      abortController.abort();
    };
  }, [currentUser, fetchCourses, isMounted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);

    if (name === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setErrors((prev) => ({
          ...prev,
          date: "You can't book a date in the past",
        }));
      } else if (selectedDate.getDate() !== 10) {
        setErrors((prev) => ({
          ...prev,
          date: 'Bookings are only available on the 10th of each month.',
        }));
      } else {
        setErrors((prev) => ({ ...prev, date: undefined }));
      }
    }
  };

  const hasChanges = () => {
    return Object.values(formData).some((value) => value.trim() !== '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    try {
      const formattedDate = new Date(formData.date).toISOString().split('T')[0];

      const response = await axiosReq.post('/bookings/', {
        date: formattedDate,
        time: formData.time,
        course: parseInt(formData.course),
        additional_info: formData.additional_info,
      });

      if (response.status === 201) {
        toast.success('Booking submitted successfully!');
        history.push('/bookings', { refresh: true });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      if (err.response?.status === 401) {
        toast.error('Your session has expired. Please sign in again.');
        history.push('/signin');
      } else if (err.response && err.response.data) {
        setErrors(err.response.data);
        if (err.response.data.non_field_errors) {
          toast.error('Try again: ' + err.response.data.non_field_errors[0]);
        } else {
          Object.entries(err.response.data).forEach(([key, value]) => {
            toast.error(`${key}: ${Array.isArray(value) ? value[0] : value}`);
          });
        }
      } else {
        setErrors({ message: 'An error occurred while creating the booking.' });
        toast.error('Failed to submit booking. Please try again.');
      }
    }
  };

  if (!hasLoaded) {
    return <Asset spinner />;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className={styles.bookingForm}>
      <h2>Book a Diving Course</h2>
      {errors.message && <div className={styles.error}>{errors.message}</div>}
      <div>
        <label htmlFor="date">Date (10th of the month):</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={today}
          required
        />
        {errors.date && <span className={styles.error}>{errors.date}</span>}
      </div>
      <div>
        <label htmlFor="time">Time (09:00 or 15:00):</label>
        <select
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        >
          <option value="">Select a time</option>
          <option value="09:00">09:00</option>
          <option value="15:00">15:00</option>
        </select>
        {errors.time && <span className={styles.error}>{errors.time}</span>}
      </div>
      <div>
        <label htmlFor="course">Diving Course:</label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title} - {course.course_type}
            </option>
          ))}
        </select>
        {errors.course && <span className={styles.error}>{errors.course}</span>}
      </div>
      <div>
        <label htmlFor="additional_info">Additional Information:</label>
        <textarea
          id="additional_info"
          name="additional_info"
          value={formData.additional_info}
          onChange={handleChange}
          rows="4"
        />
      </div>
      <button
        className={`${styles.Button} ${!isChanged || !hasChanges() ? styles.DisabledButton : ''}`}
        type="submit"
        disabled={!isChanged || !hasChanges()}
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;
