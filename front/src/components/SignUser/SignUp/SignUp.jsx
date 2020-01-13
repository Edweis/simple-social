import React, { useState } from 'react';
import { post } from '../../../apiCalls';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const submitUser = async () => {
    const user = { email, password, username };
    const results = await post('/api/users', { user });
    console.debug(await results.json());
    if (results.status !== 200)
      setMessage('An error occured, please check your informations');
    else {
      setMessage(
        `Welcome ${username}, your account has been created. Try to login !`,
      );
    }

    // const error = createUser(user);
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
        {message != null && <span>{message}</span>}
        <input type="button" value="Submit" onClick={submitUser} />
      </form>
    </div>
  );
};
export default SignIn;
