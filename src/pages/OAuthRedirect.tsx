import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationId = params.get('location_id');
    console.log(locationId,'locationIdlocationIdlocationId');
    if (locationId) {
      localStorage.setItem('location_id', locationId);
      navigate('/settings');
    }
  }, [location]);

  return <p>Redirecting...</p>;
};

export default OAuthRedirect;
