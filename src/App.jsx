import React, { useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login';
import Home from './pages/Home';
import Space from './pages/Space';
import MyMeetings from './pages/MyMeetings';


function App() {

  const [currentUser, setCurrentUser] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setCurrentUser={setCurrentUser} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
