import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = ({ className }) => {
  const currentYear = new Date().getFullYear();

  // روابط التواصل الاجتماعي الخاصة بك
  const socialLinks = [
    {
      href: 'https://github.com/MOHAMEDELKADY1010',
      icon: 'fab fa-github',
      label: 'GitHub',
    },
    {
      href: 'https://www.linkedin.com/in/mohamed-elkady-bb9173178/',
      icon: 'fab fa-linkedin',
      label: 'LinkedIn',
    },
  ];

  return (
    <footer className={`${styles.footer} ${className}`}>
      <p className={styles.footerText}>
        &copy; {currentYear} Mohamed Elkady. All rights reserved.
      </p>

      <div className={styles['footer-icons']}>
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            <i className={link.icon}></i>
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
