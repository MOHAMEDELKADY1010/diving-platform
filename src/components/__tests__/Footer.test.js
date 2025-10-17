import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer'; // Adjust the import path as needed
import '@testing-library/jest-dom/extend-expect';

describe('Footer', () => {
  test('renders footer with current year and social links', () => {
    const currentYear = new Date().getFullYear();
    const { container } = render(<Footer className="test-class" />);

    // Check for the current year
    expect(
      screen.getByText(`© ${currentYear} Amir Shkolnik. All rights reserved.`)
    ).toBeInTheDocument();

    // Check for social links
    const githubLink = screen.getByLabelText('GitHub');
    const linkedinLink = screen.getByLabelText('LinkedIn');

    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/AmirShkolnik'
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/amirshkolnik/'
    );
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check for additional class
    expect(container.firstChild).toHaveClass('test-class');
  });
});
