import React from 'react';
import { render, screen } from '@testing-library/react';
import Forbidden403 from '../Forbidden403'; // Adjust the import path as needed
import '@testing-library/jest-dom/extend-expect';
import styles from '../../styles/NotFound.module.css'; // Adjust the import path as needed

describe('Forbidden403', () => {
  test('renders without crashing', () => {
    render(<Forbidden403 />);

    // Check if the Forbidden403 component renders
    expect(screen.getByText('403 - Forbidden')).toBeInTheDocument();
  });

  test('displays the correct image and text', () => {
    render(<Forbidden403 />);

    // Check if the image is displayed
    const imgElement = screen.getByAltText('Forbidden');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(
      'src',
      expect.stringContaining('no-results.webp')
    );

    // Check if the header is displayed
    expect(screen.getByText('403 - Forbidden')).toBeInTheDocument();

    // Check if the description text is displayed
    expect(
      screen.getByText(
        /Oops! It looks like you've stumbled into restricted waters./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You don't have permission to access this area./i)
    ).toBeInTheDocument();
  });

  test('applies the correct styles', () => {
    const { container } = render(<Forbidden403 />);

    const errorPageDiv = container.querySelector(`.${styles.ErrorPage}`);
    expect(errorPageDiv).toBeInTheDocument();

    const contentDiv = container.querySelector(`.${styles.ErrorContent}`);
    expect(contentDiv).toBeInTheDocument();
  });
});
