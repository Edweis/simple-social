import React, { useState } from 'react';
import { checkIsEmail } from './helpers';
import './signIn.scss';
import { post } from '../../../apiCalls';

const SignIn = ({ login }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const submitLogin = async () => {
    const isEmail = checkIsEmail(identifier);
    const user = { password };
    if (isEmail) user.email = identifier;
    else user.username = identifier;
    const response = await post('/api/users/login', { user });
    if (response.status !== 200)
      setMessage('An error occured, check your credentials.');
    else {
      const richUser = await response.json();
      login(richUser.user);
    }
  };
  return (
    <div className="container">
      <form>
        <label>
          email/username:
          <input
            type="text"
            name="name"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
          />
        </label>
        <label>
          password:
          <input
            type="password"
            name="name"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        {message != null && <span>{message}</span>}
        <input type="button" value="Submit" onClick={submitLogin} />
      </form>
    </div>
  );
};
export default SignIn;
