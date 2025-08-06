// pages/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {logoutUser} from '../api/auth'


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await logoutUser();
        navigate('/')
      } catch (err) {
        console.error('Logout failed:', err); 
      } 
    };

    logout();
  }, [navigate]);

  return (
    <div className="text-center mt-20 text-lg text-gray-600">
      Logging you out...
    </div>
  );
};

export default Logout;
