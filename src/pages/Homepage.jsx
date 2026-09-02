import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function Homepage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/sign-in', { replace: true });
    }
  }, [user, loading]);

  return null;
}

export default Homepage;