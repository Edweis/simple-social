import React from 'react';
import './signUser.scss';
import UserInfo from './UserInfo';
import SignIn from './SignIn';

const SignUser = ({ loggedUser, setLoggedUser }) => {
  const isConnected = loggedUser != null;
  const logout = () => setLoggedUser(null);
  const login = user => () => setLoggedUser(user);

  if (isConnected) return <UserInfo user={loggedUser} logout={logout} />;
  return <SignIn login={login} />;
};
export default SignUser;
