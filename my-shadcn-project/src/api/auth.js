import API from './AxiosInstance';

export const loginUser = (username, password) => 
  API.post('/api/accounts/auth/login/', { username, password }, {
      headers: {
        'X-Client-Type': 'web'
      }
    }
  );

export const LogoutUser = () => 
  API.post('/api/accounts/auth/logout/');

export const refreshtoken = () => 
  API.post('/api/accounts/auth/refresh/', {
      headers: {
        'X-Client-Type': 'web'
      }
    }
  );


export const getUser = () =>
  API.get('/api/accounts/user');

export const patchUser = (formData) =>
  API.patch('/api/accounts/user', formData);


export const PassworChangeAPI = (formData) => 
  API.patch('/api/accounts/auth/password-change/', formData);

