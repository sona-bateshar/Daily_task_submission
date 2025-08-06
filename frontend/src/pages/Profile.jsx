// pages/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/AxiosInstance'; // Your axios instance
import {getUserDetails} from '../api/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserDetails();
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-card rounded-2xl mt-10">
      {/* Header */}
      <h1 className="text-title font-heading mb-6 text-center">User Profile</h1>

      {/* Profile photo and name */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.profile_photo || '/default-profile.png'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold text-text">{user.first_name} {user.last_name}</h2>
          <p className="text-muted">{user.username}</p>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-text">
        <Detail label="Email" value={user.email} />
        <Detail label="Phone" value={user.phone_number} />
        <Detail label="DOB" value={user.date_of_birth} />
        <Detail label="Joined" value={user.date_joined?.split('T')[0]} />
        <Detail label="Active" value={user.is_user_active ? 'Yes' : 'No'} />
        <Detail label="Company" value={user.company} />
        <Detail label="Branch" value={user.branch} />
        <Detail label="Role" value={user.role} />
        <Detail label="Department" value={user.department} />
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={() => navigate('/edit-profile')}
          className="px-4 py-2 bg-primary text-white rounded-xl shadow-input"
        >
          Edit Profile
        </button>
        <button
          onClick={() => navigate('/change-password')}
          className="px-4 py-2 bg-secondary text-white rounded-xl shadow-input"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-muted text-sm">{label}</p>
    <p>{value || '-'}</p>
  </div>
);

export default Profile;
