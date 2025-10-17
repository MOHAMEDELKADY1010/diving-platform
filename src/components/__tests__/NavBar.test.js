import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from '../../contexts/CurrentUserContext';
import NavBar from '../NavBar';

test('renders NavBar', () => {
  render(
    <Router>
      <NavBar />
    </Router>
  );

  const signInLink = screen.getByRole('link', { name: 'Sign in' });
  expect(signInLink).toBeInTheDocument();
});

test('renders user profile dropdown for a logged in user', async () => {
  render(
    <Router>
      <CurrentUserProvider>
        <NavBar />
      </CurrentUserProvider>
    </Router>
  );

  const userAvatar = await screen.findByAltText('avatar');
  const userName = await screen.findByText('Ben');
  expect(userAvatar).toBeInTheDocument();
  expect(userName).toBeInTheDocument();
});

test('renders Sign in and Sign up buttons again on log out', async () => {
  render(
    <Router>
      <CurrentUserProvider>
        <NavBar />
      </CurrentUserProvider>
    </Router>
  );

  // Open the dropdown
  const dropdownToggle = await screen.findByRole('button', { name: /Ben/i });
  fireEvent.click(dropdownToggle);

  // Find and click the sign out option
  const signOutOption = await screen.findByText(/sign out/i);
  fireEvent.click(signOutOption);

  // Check for Sign in and Sign up links
  const signInLink = await screen.findByRole('link', { name: /sign in/i });
  const signUpLink = await screen.findByRole('link', { name: /sign up/i });

  expect(signInLink).toBeInTheDocument();
  expect(signUpLink).toBeInTheDocument();
});
