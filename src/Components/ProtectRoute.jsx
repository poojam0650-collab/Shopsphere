import { Navigate, useLocation } from 'react-router-dom';

function ProtectRoute({ children }) {
  const location = useLocation();
  const currentUser = localStorage.getItem('shopSphereCurrentUser');

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectRoute;