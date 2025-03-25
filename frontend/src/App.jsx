import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/App.css'
import './styles/tailwind.css';
import LandingPage from './pages/LandingPage'
import Sessions from './pages/Sessions'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App