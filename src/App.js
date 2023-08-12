import React, { useEffect, useState } from 'react';
import './App.css';
import EditForm from './EditForm';

function App() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // Track if the "Add New Post" form should be shown
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [cartIds, setCartIds] = useState([]);

  // Fetch all posts on component mount
  useEffect(() => {
    fetch('https://my-json-server.typicode.com/visalnaqvi/ecommerce/products/')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching data:', error));

    fetch('https://my-json-server.typicode.com/visalnaqvi/ecommerce/cart/')
      .then(response => response.json())
      .then(data => {
        setCartIds(data)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleEditClick = (postId) => {
    setEditingPostId(postId);
  };

  const handleUpdatePost = (updatedPost) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedPost),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(updatedPost => {
        const updatedPosts = posts.map(post =>
          post.id === updatedPost.id ? updatedPost : post
        );
        setPosts(updatedPosts);
        setEditingPostId(null);
      })
      .catch(error => console.error('Error updating post:', error));
  };

  const handleDeletePost = (postId) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
        setEditingPostId(null);
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  const handleAddFormToggle = () => {
    setShowAddForm(!showAddForm);
  };

  const handleAddPost = () => {
    if (!newPostTitle || !newPostBody) return;

    const newPost = {
      title: newPostTitle,
      body: newPostBody,
      userId: 1, // You can adjust the user ID as needed
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(newPost => {
        setPosts([...posts, newPost]);
        setShowAddForm(false);
        setNewPostTitle('');
        setNewPostBody('');
      })
      .catch(error => console.error('Error adding new post:', error));
  };

  return (
    <div className="App">
      <h1>Posts</h1>
      <button className="add-button" onClick={handleAddFormToggle}>
        Add New Post
      </button>
      {
        cartIds && 
        <div className='cart'>
        {posts && posts.map(post=>(
          cartIds.includes(post.id) ? 
          <div>
            <img className='thumbnail' src={post.img} />
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div> : <div></div>
        ))}
        </div>
      }
      {showAddForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <textarea
            placeholder="Body"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
          ></textarea>
          <button onClick={handleAddPost}>Create Post</button>
        </div>
      )}
      <div className='container'>
        {posts && posts.map(post => (

            <div key={post.id} className="post-card">
              {editingPostId === post.id ? (
                <EditForm post={post} onUpdate={handleUpdatePost} onDelete={handleDeletePost} />
              ) : (
                <>
                <img src={post.img} />
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <button onClick={() => handleEditClick(post.id)}>Edit</button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          
        ))}
      </div>
    </div>
  );
}

export default App;
