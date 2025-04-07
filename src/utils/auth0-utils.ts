import { User } from '@auth0/auth0-react';

// Debug utility to log authentication lifecycle
export const logAuthenticationFlow = (
  isLoading: boolean,
  isAuthenticated: boolean,
  user?: User
) => {
  console.log('Auth0 Status:', {
    isLoading,
    isAuthenticated,
    user: user ? {
      email: user.email,
      name: user.name,
      sub: user.sub
    } : null
  });
};

// Helper to check if we're in a post-authentication redirect
export const isAuthCallback = () => {
  const params = new URLSearchParams(window.location.search);
  return params.has('code') && params.has('state');
};
