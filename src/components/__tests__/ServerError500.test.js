import React from 'react';
import { render, screen } from '@testing-library/react';
import ServerError500 from '../ServerError500'; // Adjust the import path as needed
import '@testing-library/jest-dom/extend-expect';
import styles from '../../styles/NotFound.module.css'; // Adjust the import path as needed

describe('ServerError500', () => {
  test('renders without crashing', () => {
    render(<ServerError500 />);

    // Check if the ServerError500 component renders
    expect(screen.getByText('500 - Internal Server Error')).toBeInTheDocument();
  });

  test('displays the correct image and text', () => {
    render(<ServerError500 />);

    // Check if the image is displayed
    const imgElement = screen.getByAltText('Server Error');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(
      'src',
      expect.stringContaining('no-results.webp')
    );

    // Check if the header is displayed
    expect(screen.getByText('500 - Internal Server Error')).toBeInTheDocument();

    // Check if the description text is displayed
    expect(
      screen.getByText(/We've hit some unexpected turbulence!/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our servers are experiencing difficulties./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Please try again later or contact support if the problem persists./i
      )
    ).toBeInTheDocument();
  });

  test('applies the correct styles', () => {
    const { container } = render(<ServerError500 />);

    const errorPageDiv = container.querySelector(`.${styles.ErrorPage}`);
    expect(errorPageDiv).toBeInTheDocument();

    const contentDiv = container.querySelector(`.${styles.ErrorContent}`);
    expect(contentDiv).toBeInTheDocument();
  });
});
