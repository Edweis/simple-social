import React, { useState, useEffect } from 'react';
import FollowLink from './FollowLink';
import { get } from '../../apiCalls';

const ListUsers = ({ subscriptions, updateUser, isConnected }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      if (isConnected) {
        const response = await get('/api/users/list');
        const payload = await response.json();
        setUsers(payload.users);
      }
    };
    fetchUsers();
  }, [isConnected]);

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
