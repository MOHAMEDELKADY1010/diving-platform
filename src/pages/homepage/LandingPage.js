import React, { useEffect } from 'react';
import styles from '../../styles/LandingPage.module.css';
import VideoPlayer from '../../components/Video/VideoPlayer.js';
import { Link, useHistory } from 'react-router-dom';
import Footer from '../../components/Footer';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import { removeTokenTimestamp } from '../../utils/utils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '../../components/Avatar';

const LandingPage = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();

  useEffect(() => {
    const checkTokenValidity = () => {
      const refreshTokenTimestamp = localStorage.getItem(
        'refreshTokenTimestamp'
      );
      if (refreshTokenTimestamp && Date.now() > refreshTokenTimestamp * 1000) {
        setCurrentUser(null);
        removeTokenTimestamp();
      }
    };

    checkTokenValidity();
  }, [setCurrentUser]);

  const handleCommunityClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      toast.warning('Please sign in to join the Diving Community.');
      history.push('/signin');
    }
  };

  const getUserProfilePath = () => {
    if (!currentUser) return '/signin';
    return `/profiles/${currentUser?.profile_id}`;
  };

  return (
    <div className={styles.landingpage}>
      <VideoPlayer publicId="ke9x3yszhi9wucopgon2" />
      <div className={styles['bg-overlay']}></div>
      <div className={styles['content-wrapper']}>
        <div className={styles['home-text']}>
          <h1>From Beginner Bubbles to Advanced Adventures</h1>
          <p>No matter your experience level, we have something for you </p>
          <p>
            Join our inclusive community or explore our diving courses designed
            for all skill sets
          </p>
        </div>
        <div className={styles['button-container']}>
          {currentUser ? (
            <Link to={getUserProfilePath()} className={styles['home-btn']}>
              <Avatar src={currentUser?.profile_image} height={40} />
              <span>Welcome Back {currentUser.username}!</span>
            </Link>
          ) : (
            <button
              className={styles['home-btn']}
              onClick={handleCommunityClick}
            >
              Diving Community
            </button>
          )}
          <Link to="/courses" className={styles['home-btn']}>
            Diving Courses
          </Link>
        </div>
      </div>
      <Footer className={styles.transparentFooter} />
    </div>
  );
};

export default LandingPage;
