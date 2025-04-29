import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
   <DashboardNavigation>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-lg mt-4" style={{ color: '#a67b5b' }}>
          Sorry, the page you visited does not exist.
        </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-3 text-white rounded-md transition"
        style={{ backgroundColor: '#a67b5b', borderColor: '#a67b5b' }}
      >
        Back to Home
      </button>
      </div>
    </div>
    </DashboardNavigation>
  );
};

export default NotFound;