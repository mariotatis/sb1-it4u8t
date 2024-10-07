import React from 'react';

function PostList({ posts }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet. Create one!</p>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.image && (
              <img src={post.image} alt="Post" className="mt-4 max-w-full h-auto" />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;