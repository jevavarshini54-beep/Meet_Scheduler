import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, spring } from 'framer-motion';
import { IconTrash, IconArrowBack } from "@tabler/icons-react";
import axios from 'axios';
import './Home.css';

function Home({currentUser, setCurrentUser}) {

	const [spaceName, setSpaceName] = useState('');
	const [spaceCode, setSpaceCode] = useState('');
	const [message, setMessage] = useState('');
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showJoinModal, setShowJoinModal] = useState(false);



	const handleCreateSpace = async () => {
		if (!spaceName.trim()) {
			setMessage('Enter space name');
			return;
		}

		try{
			const res = await axios.post('http://localhost:5000/api/spaces/create', {
				name: spaceName.trim(),
				userId : currentUser._id
			});
			setSpaces([...spaces, res.data.space]);
			setShowCreateModal(false);
			setSpaceName('');
    	setMessage('');
		}

		catch(err){
			setMessage("Something went wrong");
		}
	};

	console.log('currentUser:', currentUser);
	const navigate = useNavigate();
	const [meetings, setMeetings] = useState([]);
	const [spaces, setSpaces] = useState([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [showCalendar, setShowCalendar] = useState(true);
	const [selectedDate, setSelectedDate] = useState(null);
	const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

	const fetchMeetings = async () => {
		try{
			const res = await axios.get(`http://localhost:5000/api/meetings/user/${currentUser._id}`);
			setMeetings(res.data.meetings);
		}

		catch(err){
			console.log("Error in fetching meets : ",err);
		}
	};

	// meeting spaces users are a part of
	const fetchSpaces = async () => {
		try{
			const res = await axios.get(`http://localhost:5000/api/spaces/user/${currentUser._id}`);
			setSpaces(res.data.spaces);
		}

		catch(err){
			console.log("Error in finding spaces : ", err);
		}
	};

	useEffect(() => {
  	fetchMeetings();
  	fetchSpaces();
	}, []);

	const getDaysInMonth = (date) => {
		return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
	};

	const getFirstDayOfMonth = (date) => {
		return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	}

	const hasMeeting = (date) => {
		return meetings.some(m => {
			const d = new Date(m.startTime);
			return d.getDate() === date && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
		});
	};

	const getMeetingsForDate = (date) => {
		return meetings.filter(m => {
			const d = new Date(m.startTime);
			return d.getDate() === date && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
		});
	};

	const isToday = (day) => {
		const today = new Date()
		return today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
	};

	const handleDayClick = (day) => {
		setSelectedDate(day);
		setShowCalendar(false);
	};

	const handleBack = (day) => {
		setSelectedDate(null);
		setShowCalendar(true);
	};

	const handleLogout = async () => {
		await axios.post('http://localhost:5000/api/users/logout');
		setCurrentUser(null);
		navigate('/');
	};

	const firstDay = getFirstDayOfMonth(currentMonth);
	const daysInMonth = getDaysInMonth(currentMonth);

  return(
		<div>
			<div>
				<div className='navbar'>
					<h1 className='title'>Meeting Scheduler</h1>
					<motion.button className='logoutBtn' onClick={handleLogout} whileHover={{y: 3, x: -3, opacity: 0.9}} whileTap={{y: 0, x: -3, opacity: 0.83}}>Logout</motion.button>
				</div>
				<h1 className='user_name'>Hi, {currentUser?.username}</h1>
			</div>
			
			<div className='left_right'>
				<AnimatePresence>
					<div className='left_cont'>
						{showCalendar && (
						<div>
							<div className='buttons'>
								<motion.button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth()-1, ))}
									whileHover={{scale: 1.08}} whileTap={{scale: 1.08}}>‹</motion.button>
								<h1>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h1>
								<motion.button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1, ))}
									whileHover={{scale: 1.08}} whileTap={{scale: 1.08}}>›</motion.button>
							</div>
							
							<div className='calendarGrid'>
								{dayNames.map(d => (
									<div key={d} className='days'>{d}</div>
								))}

								{/* empty cells */}
								{Array(firstDay).fill(null).map((_, i) => (<div key={`empty-${i}`}></div>))}
								{Array(daysInMonth).fill(null).map((_, i) => {
									const day = i+1;
									const hasMeet = hasMeeting(day);
									const isTod = isToday(day);
									return (
										<motion.div onClick={() => handleDayClick(day)} className={`dates ${hasMeet ? 'hasMeeting' : ''} ${isTod ? 'today' : ''}`} key={day}
											whileHover={{scale: 0.95, filter: "blur(0.3px)", transition: {type: "spring", stiffness: 200, damping: 17}}}
											whileTap={{scale: 0.95, filter: "blur(1.4px)", transition: {type: "spring", stiffness: 200, damping: 17}}}>{day}</motion.div>
									)
								})}
							</div>
						</div>
						)}

						{!showCalendar && (
							<div className='your_meets'>
								<button onClick={handleBack} className='back_btn'><IconArrowBack size={20} /></button>

								{getMeetingsForDate(selectedDate).length === 0 ? (
									<div className='no_meet'>No meetings for this day</div>
								) : (
									getMeetingsForDate(selectedDate).map(m => (
										<div>
											<p>{m.title}</p>
											<p>{new Date(m.startTime).toLocaleDateString()} •{' '}
											{new Date(m.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} •{' '}
											{m.duration} mins</p>
											{m.description && <p>{m.description}</p>}
											<p>{m.createdBy?.username}</p>

										{/* only the creator sees the delete button*/}
										{m.createdBy?._id === currentUser._id && (
											<IconTrash size={20}></IconTrash>
										)}
										</div>
									))
								)}
							</div>
						)}
					</div>
				</AnimatePresence>

				<div className='right_cont'>

					<div className='right_cont_btns'>
						<motion.button whileHover={{scale: 1.09, opacity: 0.7, y: 3, transition: {type: "spring", stiffness: 300, damping: 20, duration: 0.5}}}
							onClick={() => setShowCreateModal(true)}>
							<h4>Create space</h4>
						</motion.button>

						<motion.button whileHover={{scale: 1.09, opacity: 0.7, y: 3, transition: {type: "spring", stiffness: 300, damping: 20, duration: 0.5}}}>
							<h4>Join space</h4>
						</motion.button>
					</div>

					<h3>Your Spaces</h3>
					{spaces.length === 0 ? (
						<p>No spaces yet!</p>
					) : (
						spaces.map((space, i) => (
							<div onClick={() => navigate(`/space/${space._id}`)}>
								<p>{space.name}</p>
								<p>{space.code}</p>
							</div>
						))
					)}

					{showCreateModal && 
						<div>
							<input type="text" placeholder='Meet-Space name...' value={spaceName}
								onChange={(e) => setSpaceName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateSpace} />
								{message && <p className='message'>{message}</p>}
								<button onClick={handleCreateSpace}>Create</button>
								<button onClick={() => {setShowCreateModal(false); setMessage('')}}>Cancel</button>
						</div>
					}
				</div>
			</div>
		</div>
  );
}
export default Home;