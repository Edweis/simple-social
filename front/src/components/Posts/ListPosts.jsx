import React from 'react';

const ListPosts = ({ posts }) => {
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
