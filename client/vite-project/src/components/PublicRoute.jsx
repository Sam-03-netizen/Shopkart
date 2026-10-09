import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'

function PublicRoute() {
  const [authStatus, setAuthStatus] = useState('checking')

  useEffect(() => {
    let active = true

    axiosInstance.get('customers/me')
      .then(() => active && setAuthStatus('authenticated'))
      .catch(() => active && setAuthStatus('unauthenticated'))

    return () => {
      active = false
    }
  }, [])

  if (authStatus === 'checking') return <p role="status">Checking your session...</p>
  if (authStatus === 'authenticated') return <Navigate to="/" replace />

  return <Outlet />
}

export default PublicRoute
