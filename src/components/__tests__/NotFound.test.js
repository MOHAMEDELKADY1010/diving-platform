import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../NotFound'; // Adjust the import path as needed
import '@testing-library/jest-dom/extend-expect';
import styles from '../../styles/NotFound.module.css'; // Adjust the import path as needed

describe('NotFound', () => {
  test('renders without crashing', () => {
    render(<NotFound />);

    // Check if the NotFound component renders
    expect(
      screen.getByText(
        /Our apologies, this page must have gotten eaten by a shark!/i
      )
    ).toBeInTheDocument();
  });

  test('displays the correct image and text', () => {
    render(<NotFound />);

    // Check if the image is displayed
    const imgElement = screen.getByAltText('No results');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(
      'src',
      expect.stringContaining('no-results.webp')
    );

    // Check if the text is displayed
    expect(
      screen.getByText(
        /Our apologies, this page must have gotten eaten by a shark!/i
      )
    ).toBeInTheDocument();
  });

  test('applies the correct styles', () => {
    const { container } = render(<NotFound />);

    const notFoundDiv = container.querySelector(`.${styles.NotFound}`);
    expect(notFoundDiv).toBeInTheDocument();

    const contentDiv = container.querySelector(`.${styles.NotFoundContent}`);
    expect(contentDiv).toBeInTheDocument();
  });
});
