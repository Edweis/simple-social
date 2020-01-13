import React from 'react';

const follow = username => {
  console.debug('following', username);
};
const unfollow = username => {
  console.debug('unfollowing', username);
};

const FollowLink = ({ username, subscriptions }) => {
  const alreadyFollowed = subscriptions.includes(username);
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
