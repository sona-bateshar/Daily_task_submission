import React, { useState } from 'react';
import {PassworChangeAPI} from '../api/auth' 

const PasswordChange = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password1: '',
    new_password2: '',
    logout_from_all_devices: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors({});
    setSuccess('');
  };

  const passwordChecks = [
    { label: 'At least 8 characters', test: pwd => pwd.length >= 8 },
    { label: 'At least one uppercase letter', test: pwd => /[A-Z]/.test(pwd) },
    { label: 'At least one digit', test: pwd => /\d/.test(pwd) },
    { label: 'At least one special character', test: pwd => /[^A-Za-z0-9]/.test(pwd) },
  ];

  const handleSubmit = async e => {
    e.preventDefault();
    
    setLoading(true);
    try {
        
      const response = await PassworChangeAPI(formData);
      console.log('Submitting form', formData); 
      setSuccess(response.data.detail || 'Password changed successfully');
      setFormData({
        old_password: '',
        new_password1: '',
        new_password2: '',
        logout_from_all_devices: false,
      });
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ['Something went wrong'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-card">
      <h2 className="text-title font-heading mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Old Password</label>
          <input
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded shadow-input"
            required
          />
          {errors.old_password && <p className="text-danger text-sm mt-1">{errors.old_password}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            name="new_password1"
            value={formData.new_password1}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded shadow-input"
            required
          />
          {errors.new_password1 && Array.isArray(errors.new_password1) && (
            <ul className="text-danger text-sm mt-1 list-disc list-inside space-y-1">
              {errors.new_password1.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}
          <div className="mt-2 space-y-1">
            {passwordChecks.map(({ label, test }, idx) => {
              const isValid = test(formData.new_password1);
              return (
                <div key={idx} className="flex items-center text-sm">
                  <span className={`w-2 h-2 mr-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className={isValid ? 'text-green-600' : 'text-gray-600'}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            name="new_password2"
            value={formData.new_password2}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded shadow-input"
            required
          />
          {formData.new_password2 &&
            formData.new_password1 !== formData.new_password2 && (
              <p className="text-danger text-sm mt-1">Passwords do not match.</p>
            )}
          {errors.new_password2 && <p className="text-danger text-sm mt-1">{errors.new_password2}</p>}
        </div>

        {/* Logout checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="logout_from_all_devices"
            checked={formData.logout_from_all_devices}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="logout_from_all_devices" className="text-sm text-gray-700">
            Logout from all devices
          </label>
        </div>

        {/* Other errors */}
        {errors.non_field_errors && (
          <ul className="text-danger text-sm list-disc list-inside space-y-1">
            {errors.non_field_errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}

        {/* Success */}
        {success && <p className="text-success text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primaryDark transition"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default PasswordChange;
