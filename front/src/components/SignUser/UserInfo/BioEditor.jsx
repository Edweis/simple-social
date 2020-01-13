import React, { useState } from 'react';
import { post } from '../../../apiCalls';

const BioEditor = ({ children, updateUser }) => {
  const [isEditOn, setIsEditOn] = useState(false);
  const [bio, setBio] = useState('');
  const saveBio = async () => {
    const results = await post('/api/users/current', { bio });
    const payload = await results.json();
    updateUser({ bio: payload.user.bio });
    setIsEditOn(false);
  };

  if (!isEditOn) {
    return (
      <>
        {children}
        <input
          type="button"
          value="editBio"
          onClick={() => setIsEditOn(true)}
        />
      </>
    );
  }
  return (
    <form>
      <label>
        bio:
        <input
          type="text"
          name="name"
          onChange={e => setBio(e.target.value)}
          value={bio}
        />
      </label>
      <input type="button" value="Save" onClick={saveBio} />
      <input type="button" value="Cancel" onClick={() => setIsEditOn(false)} />
    </form>
  );
};
export default BioEditor;
