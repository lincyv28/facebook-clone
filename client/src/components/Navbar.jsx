import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Navbar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState({ users: [], posts: [] })
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  // Get logged-in user's name from localStorage
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : null

  // Search as user types (with a small delay to avoid too many requests)
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        performSearch(searchQuery)
      } else {
        setResults({ users: [], posts: [] })
        setShowDropdown(false)
      }
    }, 400)

    return () => clearTimeout(delayTimer)
  }, [searchQuery])

  const performSearch = async (query) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/search?q=${query}`)
      setResults(response.data)
      setShowDropdown(true)
    } catch (error) {
      console.log(error)
    }
  }

  // Close dropdown when clicking outside the search box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goToPost = (postId) => {
    setShowDropdown(false)
    setSearchQuery('')
    navigate(`/post/${postId}`)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 100
    }}>

      {/* Left side - Logo */}
      <div style={{ color: '#1877f2', fontSize: '32px', fontWeight: 'bold' }}>
        f
      </div>

      {/* Middle - Search bar */}
      <div ref={searchRef} style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search Facebook"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => { if (searchQuery.trim() !== '') setShowDropdown(true) }}
          style={{
            backgroundColor: '#f0f2f5',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '15px',
            outline: 'none',
            width: '240px'
          }}
        />

        {/* Search results dropdown */}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '44px',
            left: 0,
            width: '320px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '8px'
          }}>

            {results.users.length === 0 && results.posts.length === 0 && (
              <div style={{ padding: '12px', textAlign: 'center', color: '#65676b', fontSize: '14px' }}>
                No results found
              </div>
            )}

            {/* Users section */}
            {results.users.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#65676b', padding: '4px 8px' }}>
                  PEOPLE
                </div>
                {results.users.map((u) => (
                  <div key={u._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    <div style={{
                      backgroundColor: '#e4e6eb',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {u.profileImage ? (
                        <img src={`http://localhost:5000${u.profileImage}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        u.firstName[0]
                      )}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {u.firstName} {u.lastName}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Posts section */}
            {results.posts.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#65676b', padding: '4px 8px' }}>
                  POSTS
                </div>
                {results.posts.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => goToPost(p._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      backgroundColor: '#e4e6eb',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {p.user.profileImage ? (
                        <img src={`http://localhost:5000${p.user.profileImage}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        p.user.firstName[0]
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>
                        {p.user.firstName} {p.user.lastName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#65676b' }}>
                        {p.text.length > 50 ? p.text.substring(0, 50) + '...' : p.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Right side - User info + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            backgroundColor: '#e4e6eb',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            cursor: 'pointer',
            overflow: 'hidden'
          }}>
            {user && user.profileImage ? (
              <img
                src={`http://localhost:5000${user.profileImage}`}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user ? user.firstName[0] : 'U'
            )}
          </div>
          <span style={{ fontWeight: '600', fontSize: '15px' }}>
            {user ? user.firstName : 'User'}
          </span>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e4e6eb',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

    </div>
  )
}

export default Navbar