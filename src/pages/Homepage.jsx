import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
}

export default Homepage;