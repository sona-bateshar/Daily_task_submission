import axios from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:8000', 
  withCredentials: true,
});

// if the authorization failed, retry the api request once with the new access token obtained using refresh token. 
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
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
      }
    }
    return Promise.reject(error);
  } 
); 



// // Attach access token automatically
// API.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('access');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// // if the authorization failed, retry the api request once with the new access token obtained using refresh token. 
// API.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     // Check if error is 401 and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem('refresh');
//       if (refreshToken) {
//         try {
//           const res = await axios.post('http://localhost:8000/api/token/refresh/', {
//             refresh: refreshToken,
//           }); 

//           const newAccessToken = res.data.access;
//           localStorage.setItem('access', newAccessToken);
//           localStorage.setItem('refresh', res.data.refresh);

//           // Update Authorization header and retry original request
//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return API(originalRequest);
//         } catch (refreshError) {
//           // // Only logout if refresh token request failed due to 401
//           if (refreshError.response?.status === 401) {
//             localStorage.removeItem('access');
//             localStorage.removeItem('refresh');
//             window.location.href = '/login';
//           } else {
//             console.error('Token refresh failed:', refreshError);
//           }
          
            
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );



export default API;

