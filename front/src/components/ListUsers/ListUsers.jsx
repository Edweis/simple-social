import React, { useState } from 'react';
import FollowLink from './FollowLink';

const sampleUser = {
  email: 'batman@mail.com',
  password: '123123',
  username: 'Bruce Wayne',
  bio: 'no bio',
};
const sampleSubs = [sampleUser.username];
const ListUsers = () => {
  const [subscriptions, setSubscriptions] = useState(sampleSubs);
  const [users, setUsers] = useState([sampleUser]);

  if (users.length === 0) return <p>No user registrated yet.</p>;
  return (
    <ul>
      {users.map(user => (
        <li>
          <b>{user.email}</b>
          <span> - {user.bio} - </span>
          <FollowLink username={user.username} subscriptions={subscriptions} />
        </li>
      ))}
    </ul>
  );
};

export default ListUsers;
