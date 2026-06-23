import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './Home.css';
navigate = useNavigate();

function Home({currentUser, setCurrentUser}) {

	const [meetings, setMeetings] = useState([]);
	const [spaces, setSpaces] = useState([]);

	const fetchMeetings = async () => {
		try{
			const res = await axios.get(`/api/meetings/user/${currentUser._id}`);
			setMeetings(res.data.meetings);
		}

		catch(err){
			console.log("Error in fetching meets : ",err);
		}
	};

	// meeting spaces users are a part of
	const fetchSpaces = async () => {
		try{
			const res = await axios.get(`api/spaces/user/${currentUser._id}`);
			setSpaces(res.data.spaces);
		}

		catch(err){
			console.log("Error in finding spaces : ", err);
		}
	};

	const getDaysInMonth = (date) => {
		return Date(date.getFullYear(), date.getFullMonth()+1, 0).getDay();
	};

	const getFirstDayOfMonth = (date) => {
		return Date(date.getFullYear(), date.getFullMonth(), 1).getDate();
	}

	const hasMeeting = (date) => {
		return meetings.some(m => {
			const d = new Date(m.startTime);
		})
	}
  return(
    <h1>Home</h1>
  );
}

export default Home;