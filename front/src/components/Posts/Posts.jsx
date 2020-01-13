import React, { useState, useEffect } from 'react';
import AddPost from './AddPost';
import ListPosts from './ListPosts';

const Posts = ({ isConnected, subscriptions }) => {
  return (
    <div className="container">
      <AddPost />
      <ListPosts isConnected={isConnected} subscriptions={subscriptions} />
    </div>
  );
};
export default Posts;
