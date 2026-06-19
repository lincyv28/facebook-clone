import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    let newErrors = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = validateForm()
    if (!isValid) return

    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      })

      // Save token and user info in browser storage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect to home page
      navigate('/home')

    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Login failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '400px'
      }}>

        {/* Logo */}
        <div style={{
          color: '#1877f2',
          fontSize: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          facebook
        </div>

        {/* Form level error */}
        {errors.form && (
          <div style={{
            backgroundColor: '#ffebe8',
            color: '#e41e3f',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Email field */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: errors.email ? '1px solid #e41e3f' : '1px solid #ccd0d5',
                borderRadius: '6px',
                outline: 'none'
              }}
            />
            {errors.email && (
              <div style={{ color: '#e41e3f', fontSize: '13px', marginTop: '4px' }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: errors.password ? '1px solid #e41e3f' : '1px solid #ccd0d5',
                borderRadius: '6px',
                outline: 'none'
              }}
            />
            {errors.password && (
              <div style={{ color: '#e41e3f', fontSize: '13px', marginTop: '4px' }}>
                {errors.password}
              </div>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#1877f2',
              color: '#ffffff',
              padding: '12px',
              fontSize: '17px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid #dadde1',
            margin: '8px 0 16px 0'
          }} />

          {/* Create account button */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/register">
              <button
                type="button"
                style={{
                  backgroundColor: '#42b72a',
                  color: '#ffffff',
                  padding: '12px 16px',
                  fontSize: '17px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Create new account
              </button>
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login