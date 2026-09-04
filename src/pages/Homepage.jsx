import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(localStorage.getItem('token') ? '/dashboard' : '/sign-in', { replace: true });
  }, [navigate]);

  return null;
}

export default Homepage;
