import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', 
  withCredentials: true
});

// if the authorization failed, retry the api request once with the new access token obtained using refresh token. 
API.interceptors.response.use(
  response => response,
  async error => {
    
    const originalRequest = error.config;
    // Check if error is 401 and we haven't retried yet
    if ((error.response?.status === 401 ) && !originalRequest._retry) {
      originalRequest._retry = true;

      try { 
        await axios.post(
          'http://localhost:8000/api/accounts/auth/refresh/',
          {}, // POST body — empty in this case
          {
            withCredentials: true,
            headers: {
              'X-Client-Type': 'web'
            }
          }
        );
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        // window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  } 
); 

export default API;