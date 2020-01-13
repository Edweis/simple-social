import React, { useState, useEffect } from 'react';
import FollowLink from './FollowLink';
import { get } from '../../apiCalls';

const ListUsers = ({ subscriptions, updateUser }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    get();
    // hacky, we update when the subscription changes (meaning the user might have changed)
  }, [subscriptions]);

  if (users.length === 0) return <p>No user registrated yet.</p>;
  return (
    <ul>
      {users.map(user => (
        <li key={user.username}>
          <b>{user.email}</b>
          <span> - {user.bio} - </span>
          <FollowLink
            username={user.username}
            subscriptions={subscriptions}
            updateUser={updateUser}
          />
        </li>
      ))}
    </ul>
  );
};

export default ListUsers;
