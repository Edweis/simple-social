import React, { useState } from 'react';
import { checkIsEmail } from './helpers';

const SignIn = ({ login }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const submitLogin = () => {
    const isEmail = checkIsEmail(identifier);
    const user = { password };
    if (isEmail) user.email = identifier;
    else user.username = identifier;
    login(user);
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
            onChange={setIdentifier}
          />
        </label>
        <label>
          password:
          <input
            type="password"
            name="name"
            value={password}
            onChange={setPassword}
          />
        </label>
        <input type="submit" value="Submit" onClick={submitLogin} />
      </form>
    </div>
  );
};
export default SignIn;
