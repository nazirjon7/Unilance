import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster position="top-right" toastOptions={{ style: { borderRadius: 10, fontFamily: 'system-ui' } }} />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
