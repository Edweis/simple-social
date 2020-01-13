import React, { useState } from 'react';
import './signUser.scss';
import UserInfo from './UserInfo';
import SignUp from './SignUp';
import SignIn from './SignIn';

const SignUser = ({ loggedUser, setLoggedUser }) => {
  const isConnected = loggedUser != null;
  const logout = () => setLoggedUser(null);
  const [isSignUpShown, setIsSignUpShown] = useState(false);

  const login = user => {
    console.debug('Login...', user);
    const richUser = {
      email: 'email@test.com',
      username: 'Batman',
      bio: 'Here is my bio',
    };
    setLoggedUser(richUser);
  };

  if (isConnected) return <UserInfo user={loggedUser} logout={logout} />;
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
