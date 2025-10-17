import React from 'react';
import ForbiddenImage from '../assets/no-results.webp';
import styles from '../styles/Forbidden403.module.css';

const Forbidden403 = () => {
  return (
    <div className={styles.ErrorPage}>
      <div className={styles.ErrorContent}>
        <img src={ForbiddenImage} alt="Forbidden" />
        <h1>403 - Forbidden</h1>
        <p>
          Oops! It looks like you&apos;ve stumbled into restricted waters. You
          don&apos;t have permission to access this area.
        </p>
      </div>
    </div>
  );
};

export default Forbidden403;
