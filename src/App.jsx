import React, { useState } from 'react';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';

function App() {
  const [posts, setPosts] = useState([]);

  const addPost = (newPost) => {
    setPosts([...posts, newPost]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog App</h1>
      <CreatePost addPost={addPost} />
      <PostList posts={posts} />
    </div>
  );
}

export default App;