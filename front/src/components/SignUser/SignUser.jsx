import React, { useState } from 'react';
import './signUser.scss';
import UserInfo from './UserInfo';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { setToken } from '../../apiCalls';

const SignUser = ({ loggedUser, setLoggedUser }) => {
  const isConnected = loggedUser != null;
  const logout = () => {
    setLoggedUser(null);
    setToken(null);
  };
  const login = user => {
    setLoggedUser(user);
    setToken(user.token);
  };
  const updateUser = partialUser => {
    console.debug({ partialUser });
    setLoggedUser(currentUser => ({ ...currentUser, ...partialUser }));
  };
  const [isSignUpShown, setIsSignUpShown] = useState(false);

  if (isConnected) {
    return (
      <UserInfo user={loggedUser} logout={logout} updateUser={updateUser} />
    );
  }
  return isSignUpShown ? (
    <>
      <SignUp />
      <input
        type="button"
        value="Have an account? Login instead."
        onClick={() => setIsSignUpShown(false)}
      />
    </>
  ) : (
    <>
      <SignIn login={login} />
      <input
        type="button"
        value="No account ? Sign up !"
        onClick={() => setIsSignUpShown(true)}
      />
    </>
  );
};
export default SignUser;
