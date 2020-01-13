import React, { useState } from 'react';

const createUser = user => {
  console.debug('creating user', { user });
};
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submitUser = () => {
    const user = { email, password, username };

    const error = createUser(user);
    // const isEmail = checkIsEmail(identifier);
    // const user = { password };
    // if (isEmail) user.email = identifier;
    // else user.username = identifier;
    // createUser(user);
  };
  return (
    <div className="container">
      <form>
        <label>
          email:
          <input
            type="text"
            name="name"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          username:
          <input
            type="text"
            name="name"
            value={username}
            onChange={e => setUsername(e.target.value)}
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
        <input type="button" value="Submit" onClick={submitUser} />
      </form>
    </div>
  );
};
export default SignIn;
