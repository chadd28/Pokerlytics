import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/App.css'
import './styles/tailwind.css';
import ProtectedRoute from './components/ProtectedRoute'
import { UserProvider } from './context/userContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register';

import UserProfile from './pages/UserProfile'
import Dashboard from './pages/Dashboard' 
import Settings from './pages/Settings'
import Sessions from './pages/Sessions'
import SessionsGraph from './pages/SessionsGraph';
import NewSession from './pages/NewSession'


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
          <Route path="/sessions-graph" element={<ProtectedRoute><SessionsGraph /></ProtectedRoute>} />
          <Route path="/new-session" element={<ProtectedRoute><NewSession /></ProtectedRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App