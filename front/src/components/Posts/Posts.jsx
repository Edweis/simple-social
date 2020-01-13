import React, { useState, useEffect } from 'react';
import AddPost from './AddPost';
import ListPosts from './ListPosts';
import { get } from '../../apiCalls';

const Posts = ({ isConnected, subscriptions }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const result = await get('/api/posts/timeline');
    const payload = await result.json();
    setPosts(payload.posts);
  };

  useEffect(() => {
    if (isConnected) fetchPosts();
  }, [isConnected, subscriptions]);

  if (!isConnected) return 'Please login to see posts.';
  return (
    <div className="container">
      <AddPost onSubmit={fetchPosts} />
      <ListPosts posts={posts} />
    </div>
  );
};
export default Posts;
