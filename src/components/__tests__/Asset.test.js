import React from 'react';
import { render, screen } from '@testing-library/react';
import Asset from '../Asset';

jest.mock('react-bootstrap', () => ({
  Spinner: () => <div>Spinner</div>,
}));

describe('Asset', () => {
  test('renders spinner when spinner prop is true', () => {
    render(<Asset spinner />);
    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  test('does not render spinner when spinner prop is false', () => {
    render(<Asset spinner={false} />);
    expect(screen.queryByText('Spinner')).not.toBeInTheDocument();
  });

  test('renders image when src prop is provided', () => {
    const src = 'test-image.jpg';
    const message = 'Test message';
    render(<Asset src={src} message={message} />);
    const image = screen.getByAltText(message);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', src);
  });

  test('does not render image when src prop is not provided', () => {
    render(<Asset />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('renders message when message prop is provided', () => {
    const message = 'Test message';
    render(<Asset message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('does not render message when message prop is not provided', () => {
    render(<Asset />);
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  test('renders all elements when all props are provided', () => {
    const src = 'test-image.jpg';
    const message = 'Test message';
    render(<Asset spinner src={src} message={message} />);
    expect(screen.getByText('Spinner')).toBeInTheDocument();
    const image = screen.getByAltText(message);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', src);
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
