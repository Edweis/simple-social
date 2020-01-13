import React from 'react';
import './signUser.scss';
import UserInfo from './UserInfo';
import SignIn from './SignIn';

const SignUser = ({ loggedUser, setLoggedUser }) => {
  const isConnected = loggedUser != null;
  const logout = () => setLoggedUser(null);
  const login = user => {
    console.debug('Login...');
    const richUser = {
      email: 'email@test.com',
      username: 'Batman',
      bio: 'Here is my bio',
    };
    setLoggedUser(richUser);
  };

  if (isConnected) return <UserInfo user={loggedUser} logout={logout} />;
  return <SignIn login={login} />;
};
export default SignUser;
