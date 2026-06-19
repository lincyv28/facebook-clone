import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    // No token found, redirect to login page
    return <Navigate to="/" replace />
  }

  // Token exists, show the protected page
  return children
}

export default ProtectedRoute