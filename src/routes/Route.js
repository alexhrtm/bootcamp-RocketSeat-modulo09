import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import AuthLayout from '~/pages/_layouts/auth';
import DefaultLayout from '~/pages/_layouts/default';

import { store } from '~/store';

export default function RouteWrapper({
  // Isso vem das rotas (path, exact, component)
  // pq está em maiúsculo? Para usar como componente do React
  component: Component,
  isPrivate,
  ...rest // todas as outras propriedades
}) {
  const { signed } = store.getState().auth; // se o usuário está logado ou não

  // se o usuário não estiver logado e a rota for privada, será redirecionado
  if (!signed && isPrivate) {
    return <Redirect to="/" />;
  }

  // se estiver logado e a rota não for privada
  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />;
  }

  // Qual layout será carregado
  const Layout = signed ? DefaultLayout : AuthLayout;

  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />{' '}
          {/* props de navegação; pro componente saber os params; acesso ao history  */}
        </Layout>
      )}
    />
  );
}

// Props validation
RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
};

RouteWrapper.defaultProps = {
  isPrivate: false,
};
