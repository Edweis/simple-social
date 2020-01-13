import React, { useState, useEffect } from 'react';
import { post as postAPI } from '../../apiCalls';

const AddPost = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const showSubmit = title !== '' && description !== '';
  const submitUser = async () => {
    const post = { title, description };
    await postAPI('/api/posts', { post });
    setTitle('');
    setDescription('');
    onSubmit();
  };
  return (
    <div className="container">
      <form>
        <label>
          title:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label>
          description:
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>
      </form>
      <input
        type="button"
        value="Submit"
        onClick={submitUser}
        disabled={!showSubmit}
      />
    </div>
  );
};
export default AddPost;
