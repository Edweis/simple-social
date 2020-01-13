import React from 'react';

const UserInfo = ({ user, logout }) => {
  return (
    <div className="container">
      <p>
        <b>username : </b>
        <span>{user.username}</span>
      </p>
      <p>
        <b>email : </b>
        <span>{user.email}</span>
      </p>
      <p>
        <BioEditor>
          <b>bio : </b>
          <span>{user.bio}</span>
        </BioEditor>
      </p>
    </div>
  );
};
export default UserInfo;
