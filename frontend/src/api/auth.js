import API from './AxiosInstance';

export const loginUser = (username, password) => 
  API.post('/api/accounts/auth/login/', { username, password }, {
      headers: {
        'X-Client-Type': 'web'
      }
    }
  );

export const logoutUser = () => 
  API.post('/api/accounts/auth/logout/');

export const refreshtoken = () => 
  API.post('/api/accounts/auth/refresh/', {
      headers: {
        'X-Client-Type': 'web'
      }
    }
  );





export const getUserDetails = () =>
  API.get('/api/accounts/auth/user');


export const PassworChangeAPI = (formData) => 
  API.patch('/api/accounts/auth/password-change/', formData);

