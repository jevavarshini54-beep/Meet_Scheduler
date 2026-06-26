import React, { useEffect, useRef, useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login';
import Home from './pages/Home';
import MyMeetings from './pages/MyMeetings';
import axios from 'axios';

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
        const res = await axios.get(`http://localhost:5000/api/meetings/user/${currentUser._id}`);
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
    const interval = setInterval(checkUpcomingMeetings, 30000);
    return () => clearInterval(interval);
  },[currentUser])

  return (
    <BrowserRouter>
      {banner && (
        <div>
          <p>{banner.title}</p>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login setCurrentUser={handleLogin} />}></Route>
        <Route path="/home" element={currentUser ? <Home currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to='/' />}></Route>
        <Route path="/space/:id" element={currentUser ? <MyMeetings currentUser={currentUser} setCurrentUser={setCurrentUser}/> : <Navigate to='/' />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
