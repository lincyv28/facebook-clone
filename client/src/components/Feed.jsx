import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CreatePost from './CreatePost'

function Feed() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [editingPostId, setEditingPostId] = useState(null)
  const [editText, setEditText] = useState('')

  const token = localStorage.getItem('token')
  const loggedInUser = JSON.parse(localStorage.getItem('user'))

  // Like / Unlike a post
  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPosts(posts.map((p) => (p._id === postId ? response.data.post : p)))
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch posts for a given page
  const fetchPosts = async (pageNumber) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts?page=${pageNumber}`)
      return response.data
    } catch (error) {
      console.log(error)
      return { posts: [], hasMore: false }
    }
  }

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true)
      const data = await fetchPosts(1)
      setPosts(data.posts)
      setHasMore(data.hasMore)
      setLoading(false)
    }
    loadInitialPosts()
  }, [])

  // When a new post is created, add it to the top
  const handlePostCreated = (post) => {
    setPosts([post, ...posts])
  }

  // Load more posts (pagination)
  const handleLoadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    const data = await fetchPosts(nextPage)
    setPosts([...posts, ...data.posts])
    setHasMore(data.hasMore)
    setPage(nextPage)
    setLoadingMore(false)
  }

  // Start editing a post
  const startEdit = (post) => {
    setEditingPostId(post._id)
    setEditText(post.text)
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingPostId(null)
    setEditText('')
  }

  // Save edited post
  const saveEdit = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Update the post in the local list
      setPosts(posts.map((p) => (p._id === postId ? response.data.post : p)))
      setEditingPostId(null)
      setEditText('')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update post')
    }
  }

  // Delete a post
  const deletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?')
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Remove the post from local list
      setPosts(posts.filter((p) => p._id !== postId))
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete post')
    }
  }

  return (
    <div style={{
      marginLeft: '280px',
      marginRight: '280px',
      marginTop: '76px',
      padding: '20px',
      minHeight: '100vh'
    }}>

      {/* Create Post Box */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Loading state for initial load */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#65676b',
          fontSize: '15px'
        }}>
          Loading posts...
        </div>
      )}

      {/* No posts yet */}
      {!loading && posts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#65676b',
          fontSize: '15px',
          backgroundColor: '#ffffff',
          borderRadius: '8px'
        }}>
          No posts yet. Be the first to post something!
        </div>
      )}

      {/* Render posts */}
      {!loading && posts.map((post) => {
        const isOwner = loggedInUser && post.user._id === loggedInUser.id

        return (
          <div key={post._id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            {/* Post Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <Link to={`/post/${post._id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  backgroundColor: '#e4e6eb',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  overflow: 'hidden'
                }}>
                  {post.user.profileImage ? (
                    <img
                      src={`http://localhost:5000${post.user.profileImage}`}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    post.user.firstName[0]
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>
                    {post.user.firstName} {post.user.lastName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#65676b' }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </Link>

              {/* Edit/Delete menu - only for post owner */}
              {isOwner && editingPostId !== post._id && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => startEdit(post)}
                    style={{
                      backgroundColor: '#f0f2f5',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post._id)}
                    style={{
                      backgroundColor: '#f0f2f5',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: '#e41e3f'
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Edit mode */}
            {editingPostId === post._id ? (
              <div style={{ marginBottom: '12px' }}>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '15px',
                    border: '1px solid #ccd0d5',
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'none',
                    marginBottom: '8px'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => saveEdit(post._id)}
                    style={{
                      backgroundColor: '#1877f2',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      backgroundColor: '#f0f2f5',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Post Text */}
                {post.text && (
                  <div style={{ fontSize: '15px', marginBottom: '12px' }}>
                    {post.text}
                  </div>
                )}
              </>
            )}

            {/* Post Image */}
            {post.image && (
              <img
                src={`http://localhost:5000${post.image}`}
                alt="Post"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              />
            )}

            {/* Like count display */}
            {post.likes.length > 0 && (
              <div style={{
                fontSize: '13px',
                color: '#65676b',
                marginBottom: '8px',
                borderTop: '1px solid #e4e6eb',
                paddingTop: '8px'
              }}>
                👍 {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </div>
            )}

            {/* Post Actions */}
            <div style={{
              display: 'flex',
              gap: '8px',
              borderTop: post.likes.length > 0 ? 'none' : '1px solid #e4e6eb',
              paddingTop: post.likes.length > 0 ? '0' : '8px'
            }}>
              <button
                onClick={() => handleLike(post._id)}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: loggedInUser && post.likes.includes(loggedInUser.id) ? '#1877f2' : '#65676b'
                }}
              >
                Like
              </button>
              <button style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#65676b'
              }}>
                Comment
              </button>
              <button style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#65676b'
              }}>
                Share
              </button>
            </div>
          </div>
        )
      })}

      {/* Load More button */}
      {!loading && hasMore && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            style={{
              backgroundColor: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1877f2',
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* End of feed message */}
      {!loading && !hasMore && posts.length > 0 && (
        <div style={{ textAlign: 'center', color: '#65676b', fontSize: '14px', padding: '20px' }}>
          You've reached the end!
        </div>
      )}

    </div>
  )
}

export default Feed