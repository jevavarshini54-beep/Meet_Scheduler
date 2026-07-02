import React, { useEffect, useState } from 'react'
import { animate, AnimatePresence, easeIn, easeInOut, motion } from 'framer-motion';
import api from '../api/AxiosInstance';
import {useNavigate, useParams} from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import './MyMeetings.css'

function MyMeetings({currentUser, setCurrentUser, onLogout}) {

  const {id} = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState([]);
	const [meetings, setMeetings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [showMeetingModal, setShowMeetingModal] = useState(false);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [time, setTime] = useState('');
	const [duration, setDuration] = useState('');

  const fetchSpace = async() => {
		try{
			const res = await api.get(`/spaces/${id}`);
			setSpace(res.data.space);
		}

		catch(err){
			console.log("Error fetching spaces : ", err);
		}
  };

	const fetchMeetings = async () => {
		try {
			const res = await api.get(`/meetings/space/${id}`);
			setMeetings(res.data.meetings);
		}
 
		catch(err){
			console.log("Error fetching meetings : ", err);
		}
	};

	useEffect(() => {
		const loadAll = async() => {
		setLoading(true);
		await Promise.all([fetchMeetings(), fetchSpace()]);
		setLoading(false);
		};
		loadAll();
	},[id]);

	const handleLogout = async () => {
		try{
			await api.post('/users/logout');
		}

		catch(err) {
			console.log("Logout error : ", err);
		}
		onLogout();
		navigate('/');
	};

	const handleCreateMeeting = async() => {
		if (!title.trim() || !duration || !date || !time){
			setMessage("Title, date, time and duration are required");
			return;
		}
		const startTime = new Date(`${date}T${time}`);

		try{
			const res = await api.post('/meetings/create',{
				title: title.trim(),
				description: description.trim(),
				startTime, duration: Number(duration),
				spaceId: id, userId: currentUser._id
			});

			const newMeeting = {
      			...res.data.meeting,
      			createdBy: { _id: currentUser._id, username: currentUser.username }
    		};

			setMeetings([...meetings, newMeeting]);
			setTitle('');
			setDescription('');
			setDuration('');
			setTime('');
			setDate('');
			setMessage('');

			setShowMeetingModal(false);
		}

		catch(err){
			setMessage(err.response?.data?.message || "Something went wrong");
		}
	};

	const handleDeleteMeeting = async(meetingId) => {
		try{
			const res = await api.delete(`/meetings/${meetingId}`,{
				data: {userId: currentUser._id}
			});
			setMeetings(meetings.filter(m => m._id !== meetingId));
			setMessage(res.data.message);
		}
		catch(err){
			setMessage(err.response?.data?.message || "Couldn't delete");
		}
	};

	if (loading) {
    return <div className='msg'>Loading space...</div>;
	}

	if (!space) {
    return <div className='msg'>Space not found</div>;
	}

	const navBar = {initial: {y: -20, opacity: 0}, animate: {y: 0, opacity: 1, transition: {duration: 1.6, ease: easeIn}}, exit: {y: -20, opacity: 0}};
	const Cont = {initial: {opacity: 0, x: -50}, animate: {opacity: 1, x: 0, transition: {duration: 2}}};
	const pop_up = {initial: {opacity: 0, y: -80}, animate: {opacity: 1, y: 0, transition: {duration: 2}}, exit: {opacity: 0, y: -80}};
	const mem_variants = {initial: {x: -40, opacity: 0}, animate: {opacity: 1, x:0, transition: {duration: 2, ease: easeInOut}}};
	const no_meets_var = {initial: {x: 40, opacity: 0}, animate: {opacity: 1, x:0, transition: {duration: 2, ease: easeInOut}}};

  return(
    <div>
			<motion.div className='navbar' variants={navBar} initial="initial" animate="animate" exit="exit">
					<h1 className='title'>Meeting Scheduler</h1>
					<motion.button className='logoutBtn' onClick={() => handleLogout()} whileHover={{y: 3, x: -3, opacity: 0.9}} whileTap={{y: 0, x: -3, opacity: 0.83}}>Logout</motion.button>
			</motion.div>
			<motion.div className='cont_2' variants={Cont} initial="initial" animate="animate">
				<h1 className='space_name'>{space.name} (Code : {space.code})</h1>
				<motion.button onClick={() => {setShowMeetingModal(true); setMessage('');}} className='add_meet_btn'
					whileHover={{opacity: 0.9, x: -3, y: 3, transition: {type: "spring", damping: 14, stiffness: 300}}}
					whileTap={{opacity: 0.8, x: -3, y: 3, scale: 0.9, transition: {type: "spring", damping: 14, stiffness: 300}}}>Add Meet</motion.button>
			</motion.div>

			<div>
				<AnimatePresence>
					{showMeetingModal && (
						<div className='overlay'>
								<motion.div className='meet_form' variants={pop_up} initial="initial" animate="animate" exit="exit">
									<div className='schedule_meet'>
										<h2>Schedule a meeting</h2>
										<input type="text" placeholder='Give a Title' value={title}
											onChange={(e) => setTitle(e.target.value)}></input>
										<input type="text" placeholder='Give description (optional)' value={description}
											onChange={(e) => setDescription(e.target.value)}></input>
										<input type="date" placeholder='Date' value={date}
											onChange={(e) => setDate(e.target.value)}></input>
										<input type="time" placeholder='Time' value={time}
											onChange={(e) => setTime(e.target.value)}></input>
										<input type="number" placeholder='Duration (in mins)' value={duration} min="0"
										onChange={(e) => setDuration(e.target.value)}></input>
										{message && <p>{message}</p>}	
									</div>

									<div className='sche_meet_btns'>
										<motion.button onClick={handleCreateMeeting} whileHover={{opacity: 0.9, x: -3, y: 3, transition: {type: "spring", damping: 14, stiffness: 300}}}
											whileTap={{opacity: 0.8, x: -3, y: 3, scale: 0.9, transition: {type: "spring", damping: 14, stiffness: 300}}}>Schedule</motion.button>
										<motion.button onClick={() => {setShowMeetingModal(false); setMessage('');}} whileHover={{opacity: 0.9, x: -3, y: 3, transition: {type: "spring", damping: 14, stiffness: 300}}}
											whileTap={{opacity: 0.8, x: -3, y: 3, scale: 0.9, transition: {type: "spring", damping: 14, stiffness: 300}}}>Cancel</motion.button>
									</div>
								</motion.div>
							</div>
					)}
				</AnimatePresence>
			</div>

			<div className='cont'>
				<motion.div className='members_names' variants={mem_variants} initial="initial" animate="animate">
					<h1>Members</h1>
					<div className='members_list'>
							{space.members.map(m => (
								<motion.button key={m._id} className='member_name'
									whileHover={{scale: 1.08, opacity: 0.9, x: 10}}>{m.username}</motion.button>
							))}
					</div>
				</motion.div>

				<div className='space_names'>
					{meetings.length === 0 ? (
						<motion.div className='no_meets' variants={no_meets_var}
							initial="initial" animate="animate">No meetings scheduled yet!!</motion.div>
					) : (
						meetings.map(m => (
							<motion.div key={m._id} className='meet_card' variants={no_meets_var} initial="initial" animate="animate" whileHover={{scale: 1.03}}>
								<motion.div className='meet_grid'>
									<div>
										<p><span className='label'>Meet&nbsp;</span><span className='value'>: {m.title}</span></p>
										{m.description && <p><span className='label'>Description&nbsp;</span><span className='value'>: {m.description}</span></p>}
										<p><span className='label'>Organised By&nbsp;</span><span className='value'>: {m.createdBy?.username}</span></p>
									</div>
									<div>
										<p><span className='label'>Duration&nbsp;</span><span className='value'>: {m.duration} mins</span></p>
										<p><span className='label'>Date&nbsp;</span><span className='value'>: {new Date(m.startTime).toLocaleDateString()}</span></p>
										<p><span className='label'>Starting Time&nbsp;</span><span className='value'>: {new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
									</div>
								</motion.div>
								{m.createdBy?._id === currentUser._id && (
									<div className='meet_row'>
										<motion.button onClick={() => handleDeleteMeeting(m._id)}
											whileHover={{opacity: 0.9, x: -3, y: 3, transition: {type: "spring", damping: 14, stiffness: 300}}}
											whileTap={{opacity: 0.8, x: -3, y: 3, scale: 0.9, transition: {type: "spring", damping: 14, stiffness: 300}}}><IconTrash size={20} />Delete</motion.button>
									</div>
								)}
							</motion.div>
						))
					)}
				</div>
			</div>
		</div>
  );
} export default MyMeetings;