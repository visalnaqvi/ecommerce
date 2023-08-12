import React, { useState } from 'react';
import './EditForm.css';
function EditForm({ post, onUpdate }) {
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);
  const [editedPrice, setEditedPrice] = useState(post.price);

  const handleUpdatePost = () => {
    if (!editedTitle || !editedBody) return;

    const editedPost = {
      ...post,
      title: editedTitle,
      body: editedBody,
      price:editedPrice
    };

    onUpdate(editedPost);
  };

  return (
    <div>
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
      />
      <textarea
        value={editedBody}
        onChange={(e) => setEditedBody(e.target.value)}
      ></textarea>
      <input
        type="text"
        value={editedPrice}
        onChange={(e) => setEditedPrice(e.target.value)}
      />
      <button onClick={handleUpdatePost}>Save</button>
    </div>
  );
}

export default EditForm;
