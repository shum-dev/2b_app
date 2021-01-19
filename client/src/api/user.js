import { apiPost } from './index';

export const logIn = (data) => apiPost('/api/user/login', data);
export const logOut = () => apiPost('/api/user/logout');
export const register = (data) => apiPost('/api/user/register', data);
export const deleteUser = (data) => apiPost('/api/user/register', data);
