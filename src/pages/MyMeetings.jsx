import React, { useEffect, useEffectEvent, useState } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import { post } from '../../../Backend/routes/meetings';

function MyMeetings({currentUser}) {

  const {id} = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
	const [meetings, setMeetings] = useState(null);
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
			const res = axios.post(`http://localhost:5000/api/spaces/${id}`);
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

	const handleCreateMeeting = async() => {
		if (!title.trim() || !duration || !date || !time){
			setMessage("Title, date, time and duration are required");
			return;
		}
		const startTime = new Date(`${date}T${time}`);

		try{
			const res = axios.post('http://localhost:5000/api/meetings/create',{
				title: title.trim(),
				description: description.trim(),
				startTime, duration: Number(duration),
				spaceId: id, userId: currentUser._id
			});

			setMeetings([...meetings, res.data.meetings]);
			setC
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
			res.status(200).json({message: "Deleted successfully"});
		}
		catch(err){
			res.status(500).json("Something went wrong");
		}
	};

  return(
    <h1>MyMeetings</h1>
  );
} export default MyMeetings;