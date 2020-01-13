import React, { useState, useEffect } from 'react';
import { get } from '../../apiCalls';

const ListPosts = ({ isConnected, subscriptions }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await get('/api/posts/timeline');
      const payload = await result.json();
      console.debug({ payload, isConnected });
      setPosts(payload.posts);
    };
    console.debug('updating', { subscriptions });
    if (isConnected) fetchPosts();
  }, [isConnected, subscriptions]);

  if (!isConnected) return 'Please login to see posts.';
  if (!posts.length) return 'No post to display.';
  return (
    <ul>
      {posts.map(post => (
        <li>
          <h3>{post.title}</h3>
          <i />
          <p>
            {post.description}
            <br />
            by {post.authorUsername}
          </p>
        </li>
      ))}
    </ul>
  );
};
export default ListPosts;
