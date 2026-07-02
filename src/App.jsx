import React, { useEffect, useRef, useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import MyMeetings from './pages/MyMeetings';
import api from './api/AxiosInstance';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css'

function App() {

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem('user')) || null
  );

  const handleLogin = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setCurrentUser(null);
  };

  const notifiedMeetings = useRef(new Set());
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default'){
      Notification.requestPermission();
    }
  },[]);

  useEffect(() => {
    if (!currentUser){
      return;
    }

    const checkUpcomingMeetings = async() => {
      try{
        const res = await api.get(`/meetings/user/${currentUser._id}`);
        const meetings = res.data.meetings;

        const now = new Date();
        meetings.forEach(m => {
          const startTime = new Date(m.startTime);
          const minutesLeft = (startTime -  now)/(60*1000) // time difference will be in milli secs

          if (minutesLeft > 0 && minutesLeft<=5 && !notifiedMeetings.current.has(m._id)){
            notifiedMeetings.current.add(m._id);

            if ('Notification' in window && Notification.permission === 'granted'){
              new Notification('Meeting will start soon!!',{
                body : `${m.title} starts at ${startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`
                });
            }
            setBanner(m);
            setTimeout(() => setBanner(null), 5000);
          }
        });
      }

      catch(err){
        console.log("Error checking upcoming meetings", err);
      }
    }

    checkUpcomingMeetings();
    const interval = setInterval(checkUpcomingMeetings, 2000);
    return () => clearInterval(interval);
  },[currentUser])

  return (
    <BrowserRouter>
      <AnimatePresence>
        {banner && (
          <div className='overlay'>
            <motion.div className='meeting_banner'
              initial={{opacity: 0, y: -40}} animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -40}} transition={{duration: 0.9}}>
              <p>{banner.title}</p>
              <p className='banner_time'>Starts at {new Date(banner.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Login setCurrentUser={handleLogin} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/home" element={currentUser ? <Home currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout}/> : <Navigate to='/' />}></Route>
        <Route path="/space/:id" element={currentUser ? <MyMeetings currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout}/> : <Navigate to='/' />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;