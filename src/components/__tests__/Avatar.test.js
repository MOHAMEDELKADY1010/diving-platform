import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from '../Avatar';

describe('Avatar', () => {
  test('renders the image with correct src, height, and width', () => {
    const src = 'test-avatar.jpg';
    const height = 50;
    render(<Avatar src={src} height={height} />);

    const image = screen.getByAltText('avatar');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', src);
    expect(image).toHaveAttribute('height', `${height}`);
    expect(image).toHaveAttribute('width', `${height}`);
  });

  test('renders the optional text when provided', () => {
    const text = 'Test User';
    render(<Avatar src="test-avatar.jpg" text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test('does not render the text when not provided', () => {
    render(<Avatar src="test-avatar.jpg" />);

    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  test('renders the image with default height when height is not provided', () => {
    const src = 'test-avatar.jpg';
    render(<Avatar src={src} />);

    const image = screen.getByAltText('avatar');
    expect(image).toHaveAttribute('height', '45');
    expect(image).toHaveAttribute('width', '45');
  });
});
