import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VideoPlayerSignUp from '../Video/VideoPlayerSignUp';

jest.mock('@cloudinary/react', () => ({
  AdvancedVideo: ({ cldVid, playsInline, ...divProps }) => {
    return (
      <div
        data-testid="mock-advanced-video"
        data-cldvid={cldVid}
        data-playsinline={playsInline ? 'true' : 'false'}
        {...divProps}
      >
        Mock AdvancedVideo
      </div>
    );
  },
}));

describe('VideoPlayerSignUp', () => {
  test('renders without crashing', () => {
    render(<VideoPlayerSignUp />);

    // Check if the VideoPlayer component renders
    expect(screen.getByTestId('mock-advanced-video')).toBeInTheDocument();
  });

  test('renders the AdvancedVideo component with correct props', () => {
    render(<VideoPlayerSignUp />);

    // Check if the AdvancedVideo component is rendered
    const videoElement = screen.getByTestId('mock-advanced-video');
    expect(videoElement).toBeInTheDocument();

    // Verify that playsInline attribute is set
    expect(videoElement).toHaveAttribute('data-playsinline', 'true');
  });

  test('applies the correct styles', () => {
    const { container } = render(<VideoPlayerSignUp />);

    // Check container styles
    const videoContainer = container.querySelector('div');
    expect(videoContainer).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      overflow: 'hidden',
    });

    // Check AdvancedVideo styles
    const videoElement = screen.getByTestId('mock-advanced-video');
    expect(videoElement).toHaveStyle({
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
    });
  });
});
