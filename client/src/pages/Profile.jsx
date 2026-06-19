import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

function Profile() {
  const [user, setUser] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  // Fetch profile data when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(response.data)
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfile()
  }, [])

  // Handle profile info update
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        { firstName, lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(response.data.user)
      setMessage('Profile updated successfully!')

      // Update localStorage too so Navbar shows new name
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage) {
      setMessage('Please select an image first')
      return
    }

    const formData = new FormData()
    formData.append('profileImage', selectedImage)

    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/profile/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      setUser(response.data.user)
      setMessage('Profile image uploaded successfully!')
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (error) {
      setMessage('Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />

      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        paddingTop: '90px',
        paddingBottom: '40px'
      }}>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>

          <h2 style={{ marginBottom: '20px' }}>My Profile</h2>

          {/* Profile Image */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={
                user.profileImage
                  ? `http://localhost:5000${user.profileImage}`
                  : 'https://via.placeholder.com/120/e4e6eb/65676b?text=No+Image'
              }
              alt="Profile"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '12px'
              }}
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                style={{ marginBottom: '8px' }}
              />
              <br />
              <button
                onClick={handleImageUpload}
                disabled={loading}
                style={{
                  backgroundColor: '#1877f2',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '8px'
                }}
              >
                Upload Image
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #dadde1', margin: '16px 0' }} />

          {/* Edit profile form */}
          <form onSubmit={handleUpdateProfile}>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '15px',
                  border: '1px solid #ccd0d5',
                  borderRadius: '6px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '15px',
                  border: '1px solid #ccd0d5',
                  borderRadius: '6px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                Email
              </label>
              <input
                type="text"
                value={user.email}
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '15px',
                  border: '1px solid #ccd0d5',
                  borderRadius: '6px',
                  outline: 'none',
                  backgroundColor: '#f0f2f5',
                  color: '#65676b'
                }}
              />
            </div>

            {message && (
              <div style={{
                color: message.includes('success') ? '#31a24c' : '#e41e3f',
                fontSize: '14px',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#42b72a',
                color: '#ffffff',
                padding: '12px',
                fontSize: '15px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile