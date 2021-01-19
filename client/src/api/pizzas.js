import { apiGet, apiPost } from './index';

export const getComponents = () => apiGet('/api/pizzas/components');
export const createPizza = (data) => apiPost('/api/pizzas', data);
export const getAllPizzas = () => apiGet('/api/pizzas');
