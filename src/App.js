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
import Profile from './pages/Profile';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight:'100vh', background:'#FAFAFA' }}>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
            * { box-sizing: border-box; }
          `}</style>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Toaster position="top-right" toastOptions={{ style:{ borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14 } }} />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
