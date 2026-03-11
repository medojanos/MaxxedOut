import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import './main.css'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Changelog from './pages/Changelog'
import Docs from './pages/Docs'
import ForgotPassword from './pages/ForgotPassword'
import DeleteAccount from './pages/DeleteAccount'
import Footer from './components/Footer'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar></Navbar>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/password-recovery" element={<ForgotPassword />} />
      <Route path="/delete-account" element={<DeleteAccount />} />
    </Routes>
    <Footer></Footer>
  </BrowserRouter>
)
