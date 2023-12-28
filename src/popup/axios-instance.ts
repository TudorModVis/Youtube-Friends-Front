import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';

const api = axios.create({
  baseURL: 'https://youtube-friends.onrender.com/api/', // Set your API base URL
});

const useInterceptor = (navigate: NavigateFunction) => {

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Redirect to login component
        navigate('/login');
      }

      return Promise.reject(error);
    }
  );
};

export default api;
export { useInterceptor };
