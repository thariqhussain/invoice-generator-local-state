import './App.css'
import SideNav from './components/SideNavbar/SideNav.jsx'
import AuthLayout from './components/AuthLayout/AuthLayout.jsx'
import Signin from './components/signin/Signin.jsx'
import Signup from './components/signup/Signup.jsx'
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import AuthRedirect from './components/AuthRedirect'
import ProtectedRoute from './components/ProtectedRoute'


export default function App() {
  const location = useLocation();
  const triggerSignout = location.state?.triggerSignout || false;

  return (
    <>
        <Routes>
          {/* Default Redirect */}
          <Route path='/' element={<Navigate to='/signin' />}/>

          {/* authentication Routes */}
          <Route 
            path='/signin' 
            element = {
                <AuthRedirect>
                  <AuthLayout triggerSignout={triggerSignout}>
                    {(setIsAnimating) => <Signin setIsAnimating={setIsAnimating} />}
                  </AuthLayout>
                </AuthRedirect>
            } 
          />
          <Route 
            path='/signup' 
            element = {
                <AuthRedirect>
                  <AuthLayout triggerSignout={triggerSignout}>
                    {(setIsAnimating) => <Signup setIsAnimating={setIsAnimating} />}
                  </AuthLayout>
                </AuthRedirect>
            } 
          />

          {/* security routes */}
          <Route 
            path='/sidenav/*'
            element = {
              <ProtectedRoute>
                <SideNav /> 
              </ProtectedRoute>
            }
          />

          {/* fallback */}
          <Route path='*' element={<h2 style={{color: 'black'}}>404 - Page not found</h2>} />
        </Routes>
    </>
  )
}