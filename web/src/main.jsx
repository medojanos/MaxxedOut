import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './main.css'

import Navbar from './components/Navbar'
import Home from './Home'
import Registration from './Registration'
import Download from './Download'
import Footer from './components/Footer'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar></Navbar>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/download" element={<Download />} />
    </Routes>
    <Footer></Footer>
  </BrowserRouter>
)
