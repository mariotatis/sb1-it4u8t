import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

function CreatePost({ addPost }) {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && editor) {
      const newPost = {
        title,
        content: editor.getHTML(),
        image: image ? URL.createObjectURL(image) : null,
      };
      addPost(newPost);
      setTitle('');
      editor.commands.setContent('');
      setImage(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <EditorContent editor={editor} className="border rounded p-2 mb-4 min-h-[200px]" />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Post
      </button>
    </form>
  );
}

export default CreatePost;