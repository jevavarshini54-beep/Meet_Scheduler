import React, { useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login';
import Home from './pages/Home';
import MyMeetings from './pages/MyMeetings';

function App() {

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem('user')) || null
  );

  // Update setCurrentUser calls
  const handleLogin = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setCurrentUser={handleLogin} />}></Route>
        <Route path="/home" element={currentUser ? <Home currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to='/' />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
