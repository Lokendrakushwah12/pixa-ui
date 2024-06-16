import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './pages/Hero'
import AboutPage from './pages/AboutPage'

function App() {
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </Router>
    )
}

export default App
