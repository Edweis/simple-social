import React from 'react';
import BioEditor from './BioEditor';

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
      <BioEditor>
        <p>
          <b>bio : </b>
          <span>{user.bio}</span>
        </p>
      </BioEditor>
      <input type="submit" value="Logout" onClick={logout} />
    </div>
  );
};
export default UserInfo;
