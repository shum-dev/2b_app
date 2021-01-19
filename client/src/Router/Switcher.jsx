/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense, useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import uniqid from 'uniqid';

import { AuthContext } from '../contexts/AuthContext';
import { routes } from './routes';

export const Switcher = () => {
  const { user } = useContext(AuthContext);
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Switch>
        {routes.map(({
          path, component: Component, privateRoute, locked,
        }) => (
          <Route
            key={uniqid.time()}
            exact
            path={path}
            render={(props) => {
              if (locked && !user?.isAdmin) {
                return <Redirect to={{ pathname: '/login', state: { error: 'Только для админов', path } }} />;
              }
              if (privateRoute && !user) {
                return <Redirect to={{ pathname: '/login', state: { error: 'Только для зарегистрированных', path } }} />;
              }
              return <Component {...props} />;
            }}
          />
        ))}
      </Switch>
    </Suspense>
  );
};
