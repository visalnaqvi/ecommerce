import React, { useEffect, useState } from 'react';
import './App.css';
import EditForm from './EditForm';

function App() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // Track if the "Add New Post" form should be shown
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostPrice, setNewPostPrice] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostImg, setNewPostImg] = useState('');
  const [cartIds, setCartIds] = useState([]);
  const [isCartOpen , setIsCartOpen] = useState(false);

  // Fetch all product on component mount
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

  //update porduct
  const handleUpdatePost = (updatedPost) => {
    fetch(`https://my-json-server.typicode.com/visalnaqvi/ecommerce/products/${updatedPost.id}`, {
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

  //delete product
  const handleDeletePost = (postId) => {
    fetch(`https://my-json-server.typicode.com/visalnaqvi/ecommerce/products/${postId}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
        setEditingPostId(null);
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  //show hide add new product form
  const handleAddFormToggle = () => {
    setShowAddForm(!showAddForm);
  };

  //add new post
  const handleAddPost = () => {
    if (!newPostTitle || !newPostBody) return;

    const newPost = {
      title: newPostTitle,
      body: newPostBody,
      price: newPostPrice,
      rating: 0,
      img:newPostImg
    };

    fetch('https://my-json-server.typicode.com/visalnaqvi/ecommerce/products', {
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
        setNewPostPrice('');
        setNewPostImg('');
      })
      .catch(error => console.error('Error adding new post:', error));
  };


  //handle cart open and close
  const handleCartOpen = ()=>{
      setIsCartOpen(!isCartOpen);
  }

  //add item to cart
  const addToCart = (id) => {
    if (cartIds.includes(id)) {
        let newCart = cartIds.filter((i) => i !== id);
        setCartIds(newCart);
    } else {
        setCartIds([...cartIds, id]);
    }
}

  return (
    <div className="App">
      <div className='header'>
        <h1>Products</h1>
        <div>
        <button className="add-button" onClick={handleAddFormToggle}>
          Add New Product
        </button>
        <button className="cart-button" onClick={handleCartOpen}>
          Cart <span>{cartIds.length}</span>
        </button>
        </div>
      </div>
      {
        isCartOpen && 
        <div className='cart'>
        {posts && posts.map(post=>(
          cartIds.includes(post.id) ? 
          <div className='cart-item'>
            <img className='thumbnail' src={post.img} />
            <div>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <button style={{marginLeft:"10px"}} className='add-to-cart-btn' onClick={() => addToCart(post.id)}>{cartIds.includes(post.id)?"Remove from Cart":"Add To Cart"}</button>
            </div>
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
            placeholder="Discription"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
          ></textarea>
          <input
            type="text"
            placeholder="Price"
            value={newPostPrice}
            onChange={(e) => setNewPostPrice(e.target.value)}
          />
           <input
            type="text"
            placeholder="Image Link"
            value={newPostImg}
            onChange={(e) => setNewPostImg(e.target.value)}
          />
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
                  <p>Rating: {post.rating} Stars</p>
                  <h4>Rs. {post.price} /-</h4> 
                  <button onClick={() => handleEditClick(post.id)}>Edit</button>
                  <button className='add-to-cart-btn' onClick={() => addToCart(post.id)}>{cartIds.includes(post.id)?"Remove from Cart":"Add To Cart"}</button>
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
