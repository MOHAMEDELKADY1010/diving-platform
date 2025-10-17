import React from 'react';
import ServerErrorImage from '../assets/no-results.webp';
import styles from '../styles/ServerError500.module.css';

const ServerError500 = () => {
  return (
    <div className={styles.ErrorPage}>
      <div className={styles.ErrorContent}>
        <img src={ServerErrorImage} alt="Server Error" />
        <h1>500 - Internal Server Error</h1>
        <p>
          We&apos;ve hit some unexpected turbulence! Our servers are
          experiencing difficulties. Please try again later or contact support
          if the problem persists.
        </p>
      </div>
    </div>
  );
};

export default ServerError500;
