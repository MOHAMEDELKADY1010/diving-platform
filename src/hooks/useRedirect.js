import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await axios.post('/dj-rest-auth/token/refresh/');

        if (userAuthStatus === 'loggedIn') {
          return;
        }
      } catch (err) {
        if (userAuthStatus === 'loggedOut') {
          history.push('/login');
        }
      }
    };

    handleRedirect();
  }, [history, userAuthStatus]);
};
