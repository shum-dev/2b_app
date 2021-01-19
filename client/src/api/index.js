import axios from 'axios';

export const setToken = (token) => {
  if (token) {
    window.localStorage.setItem('jwtToken', token);
  } else {
    window.localStorage.removeItem('jwtToken');
  }
};

export const setTokenHeader = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    setToken(token);
  } else {
    delete axios.defaults.headers.common.Authorization;
    setToken();
  }
};

export const apiPost = (url, data) => axios.post(url, data);
export const apiGet = (url) => axios.get(url);
export const apiDelete = (url, data) => axios.delete(url, data);
