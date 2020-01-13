import React from 'react';
import { post, remove } from '../../apiCalls';

const FollowLink = ({ username, subscriptions, updateUser }) => {
  const alreadyFollowed = subscriptions.includes(username);

  const follow = async subscription => {
    const response = await post('/api/users/current', { subscription });
    const payload = await response.json();
    updateUser({ subscriptions: payload.user.subscriptions });
  };

  const unfollow = async subscription => {
    const response = await remove('/api/users/current', { subscription });
    const payload = await response.json();
    updateUser({ subscriptions: payload.user.subscriptions });
  };
  if (alreadyFollowed) {
    return (
      <a href="#" onClick={() => unfollow(username)}>
        unfollow
      </a>
    );
  }
  return (
    <a href="#" onClick={() => follow(username)}>
      follow
    </a>
  );
};

export default FollowLink;
