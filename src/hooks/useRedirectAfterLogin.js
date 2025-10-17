import { useLocation } from 'react-router-dom';

export const useRedirectAfterLogin = () => {
  const location = useLocation();

  const getRedirectUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('next') || '/';
  };

  return getRedirectUrl;
};
