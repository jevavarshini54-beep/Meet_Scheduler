import React, { useEffect, useState } from 'react'
import { easeIn, motion } from 'framer-motion';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import './MyMeetings.css'

function MyMeetings({currentUser, setCurrentUser}) {

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
			const res = await axios.get(`http://localhost:5000/api/spaces/${id}`);
			setSpace(res.data.space);
		}

		catch(err){
			console.log("Error fetching spaces : ", err);
		}
  };

	const fetchMeetings = async () => {
		try {
			const res = await axios.get(`http://localhost:5000/api/meetings/space/${id}`);
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
		await axios.post('http://localhost:5000/api/users/logout');
		setCurrentUser(null);
		navigate('/');
	};

	const handleCreateMeeting = async() => {
		if (!title.trim() || !duration || !date || !time){
			setMessage("Title, date, time and duration are required");
			return;
		}
		const startTime = new Date(`${date}T${time}`);

		try{
			const res = await axios.post('http://localhost:5000/api/meetings/create',{
				title: title.trim(),
				description: description.trim(),
				startTime, duration: Number(duration),
				spaceId: id, userId: currentUser._id
			});

			setMeetings([...meetings, res.data.meeting]);
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
			const res = await axios.delete(`http://localhost:5000/api/meetings/${meetingId}`,{
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
    return <div>Loading space...</div>;
	}

	if (!space) {
    return <div>Space not found</div>;
	}

	const navBar = {initial: {y: -20, opacity: 0}, animate: {y: 0, opacity: 1, transition: {duration: 1.6, ease: easeIn}}, exit: {y: -20, opacity: 0}};

  return(
    <div>
			<motion.div className='navbar' variants={navBar} initial="initial" animate="animate" exit="exit">
					<h1 className='title'>Meeting Scheduler</h1>
					<motion.button className='logoutBtn' onClick={handleLogout} whileHover={{y: 3, x: -3, opacity: 0.9}} whileTap={{y: 0, x: -3, opacity: 0.83}}>Logout</motion.button>
			</motion.div>
			<div className='cont_2'>
				<h1 className='space_name'>{space.name} (Code : {space.code})</h1>
				<button onClick={() => {setShowMeetingModal(true); setMessage('');}} className='add_meet_btn'>Add Meet</button>
			</div>

			<div>
				{showMeetingModal && (
					<div className='overlay'>
							<div className='meet_form'>
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
									<button onClick={handleCreateMeeting}>Schedule</button>
									<button onClick={() => {setShowMeetingModal(false); setMessage('');}}>Cancel</button>
								</div>
							</div>
						</div>
				)}
			</div>

			<div className='cont'>
				<div className='members_names'>
					<h1>Members</h1>
						{space.members.map(m => (
							<div key={m._id} className='member_name'>• {m.username}</div>
						))}
				</div>
				<div className='space_names'>
					{meetings.length === 0 ? (
						<div className='no_meets'>No meetings scheduled yet!!</div>
					) : (
						meetings.map(m => (
							<div key={m._id} className='meet_card'>
								<div>
									<p>Meet : {m.title}</p>
									<p>Description : {m.description}</p>
								</div>
								<div>
									<p>Organised By : {m.createdBy?.username}</p>
									<p>Duration : {m.duration} mins</p>
								</div>
								<div>
									<p>Date : {new Date(m.startTime).toLocaleDateString()}</p>
									<p>Starting Time : {new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
								</div>
								{m.createdBy?._id === currentUser._id && (
												<button onClick={() => handleDeleteMeeting(m._id)}><IconTrash size={20} />Delete</button>
										)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
  );
} export default MyMeetings;