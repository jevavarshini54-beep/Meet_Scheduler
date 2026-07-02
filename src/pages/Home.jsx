import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, spring, color, animate, easeIn, easeOut } from 'framer-motion';
import { IconTrash, IconArrowBack } from "@tabler/icons-react";
import api from '../api/AxiosInstance';
import './Home.css';

function Home({currentUser, setCurrentUser, onLogout}) {

	const [spaceName, setSpaceName] = useState('');
	const [spaceCode, setSpaceCode] = useState('');
	const [message, setMessage] = useState('');
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showJoinModal, setShowJoinModal] = useState(false);

	const handleJoinSpace = async () => {
		if (!spaceCode.trim()) {
			setMessage('Enter meet code');
			return;
		}

		try{
			const res = await api.post('/spaces/join_meetspace', {
				userId : currentUser._id,
				code : spaceCode.trim()
			});
			setSpaces([...spaces, res.data.space]);
    	setShowJoinModal(false);
    	setSpaceCode('');
    	setMessage('');
		}

		catch(err){
			setMessage(err.response?.data?.message || "Something went wrong");
		}
	}

	const handleCreateSpace = async () => {
		if (!spaceName.trim()) {
			setMessage('Enter space name');
			return;
		}

		try{
			const res = await api.post('/spaces/create', {
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
			const res = await api.get(`/meetings/user/${currentUser._id}`);
			setMeetings(res.data.meetings);
		}

		catch(err){
			console.log("Error in fetching meets : ",err);
		}
	};

	// meeting spaces users are a part of
	const fetchSpaces = async () => {
		try{
			const res = await api.get(`/spaces/user/${currentUser._id}`);
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
		try{
			await api.post('/users/logout');
		}

		catch(err) {
			console.log("Logout error", err);
		}
		onLogout();
		navigate('/');
	};

	const firstDay = getFirstDayOfMonth(currentMonth);
	const daysInMonth = getDaysInMonth(currentMonth);

	const navBar = {initial: {y: -20, opacity: 0}, animate: {y: 0, opacity: 1, transition: {duration: 1.6, ease: easeIn}}, exit: {y: -20, opacity: 0}};
	const leftCont = {initial: {x: -60, opacity: 0}, animate: {x: 0, opacity: 1, transition: {duration: 2, ease: easeIn}}, exit: {x: -60, opacity: 0}};
	const rightCont = {initial: {x: 60, opacity: 0}, animate: {x: 0, opacity: 1, transition: {duration: 2, ease: easeIn}}, exit: {x: 60, opacity: 0}};
	const leftMeet = {initial: {x: 18, opacity: 0},animate: {x: 0, opacity: 1, transition: {duration: 0.7, ease: easeOut}}};
	const rightSpace = {initial: {x: -18, opacity: 0},animate: {x: 0, opacity: 1, transition: {duration: 0.7, ease: easeOut}}};
	const popUp = {initial: {opacity: 0, y: -80}, animate: {opacity: 1, y: 0, transition: {duration: 2}}, exit: {opacity: 0, y: -80}};

  return(
		<div>
			<motion.div variants={navBar} initial="initial" animate="animate" exit="exit">
				<div className='navbar'>
					<h1 className='title'>Meeting Scheduler</h1>
					<motion.button className='logoutBtn' onClick={handleLogout} whileHover={{y: 3, x: -3, opacity: 0.9}} whileTap={{y: 0, x: -3, opacity: 0.83}}>Logout</motion.button>
				</div>
				<h1 className='user_name'>Hi, {currentUser?.username}</h1>
			</motion.div>
			
			<div className='left_right'>
				<AnimatePresence>
					<motion.div className='left_cont' variants={leftCont} initial="initial" animate="animate" exit="exit">
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
									<motion.div className='no_meet' variants={leftMeet} initial="initial" animate="animate">No meetings for this day</motion.div>
								) : (
									getMeetingsForDate(selectedDate).map(m => (
										<motion.div className='behind_cal' key={m._id} variants={leftMeet} initial="initial" animate="animate">
											<p>Title : {m.title}</p>
											<p>Details : {new Date(m.startTime).toLocaleDateString()} •{' '}
											{new Date(m.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} •{' '}
											{m.duration} mins</p>
											{m.description && <p>Description : {m.description}</p>}
											<p>Organised By : {m.createdBy?.username}</p>
										</motion.div>
									))
								)}
							</div>
						)}
					</motion.div>
				</AnimatePresence>

				<motion.div className='right_cont' variants={rightCont} initial="initial" animate="animate" exit="exit">

					<div className='right_cont_btns'>
						<motion.button whileHover={{scale: 1.09, opacity: 0.7, y: 3, transition: {type: "spring", stiffness: 300, damping: 20, duration: 0.5}}}
							onClick={() => setShowCreateModal(true)}>
							<h4>Create space</h4>
						</motion.button>

						<motion.button whileHover={{scale: 1.09, opacity: 0.7, y: 3, transition: {type: "spring", stiffness: 300, damping: 20, duration: 0.5}}}
							onClick={() => setShowJoinModal(true)}>
							<h4>Join space</h4>
						</motion.button>
					</div>

					<div className='heading'>Your Spaces :</div>
					{spaces.length === 0 ? (
						<div className='no_space' variants={rightSpace} initial="initial" animate="animate">No spaces yet!</div>
					) : (
						spaces.map((space, i) => (
							<motion.div onClick={() => navigate(`/space/${space._id}`)} className='space' key={space._id}
								whileHover={{scale: 1.02, transition: {type: "spring", stiffness: 300, damping: 10}}}
								 variants={rightSpace} initial="initial" animate="animate">
								<div className='space_box'>• <span>Space Name : </span>{space.name} •</div>
								<div className='space_box'>• <span>Space Code : </span>{space.code} •</div>
							</motion.div>
						))
					)}

					{showCreateModal &&  
						<AnimatePresence>
							<div className='overlay'>
								<motion.div className='space_info' variants={popUp} initial="initial" animate="animate" exit="exit">
									<input type="text" placeholder='Space name' value={spaceName} className='input_box'
										onChange={(e) => setSpaceName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateSpace()} />
									{message && <p className='message'>{message}</p>}
									<div className='space_buttons'>
										<motion.button onClick={handleCreateSpace} whileHover={{scale: 1.06, opacity: 0.96}} whileTap={{scale: 1.06, opacity: 0.96}}>Create</motion.button>
										<motion.button onClick={() => {setShowCreateModal(false); setMessage('')}} whileHover={{scale: 1.06, opacity: 0.96}} whileTap={{scale: 1.06, opacity: 0.96}}>Cancel</motion.button>
									</div>
								</motion.div>
							</div>
						</AnimatePresence>
					}

					{showJoinModal &&	
						<AnimatePresence>
							<div className='overlay'>
								<motion.div className='space_info' variants={popUp} initial="initial" animate="animate" exit="exit">
									<input type="text" placeholder='Space code' value={spaceCode} className='input_box'
										onChange={(e) => setSpaceCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleJoinSpace()}/>
									{message && <p className='message'>{message}</p>}
									<div className='space_buttons'>
										<motion.button onClick={() => handleJoinSpace()} whileHover={{scale: 1.06, opacity: 0.96}} whileTap={{scale: 1.06, opacity: 0.96}}>Join</motion.button>
										<motion.button onClick={() => {setShowJoinModal(false); setMessage('')}} whileHover={{scale: 1.06, opacity: 0.96}} whileTap={{scale: 1.06, opacity: 0.96}}>Cancel</motion.button>
									</div>
								</motion.div>
							</div>
						</AnimatePresence>
					}
				</motion.div>
			</div>
		</div>
  );
}
export default Home;