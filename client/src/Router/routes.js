import { lazy } from 'react';

const Homepage = lazy(() => import('../Pages/HomePage'));
const CreatePizza = lazy(() => import('../Pages/CreatePizza'));
const LoginPage = lazy(() => import('../Pages/LoginPage'));
const RegisterPage = lazy(() => import('../Pages/RegisterPage'));
const PizzaList = lazy(() => import('../Pages/PizzaList'));
const Page404 = lazy(() => import('../Pages/Page404'));

export const routes = [
  {
    path: '/',
    component: Homepage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
  {
    path: '/pizzas/create',
    component: CreatePizza,
    privateRoute: true,
  },
  {
    path: '/pizzas',
    component: PizzaList,
    privateRoute: true,
    locked: true,
  },
  {
    path: '*',
    component: Page404,
  },
];
