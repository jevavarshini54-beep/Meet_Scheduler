import React, { useEffect, useEffectEvent, useState } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

function MyMeetings({currentUser}) {

  const {id} = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
	const [meetings, setMeetings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState('');

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
			setTitle('');
			setDescription('');
			setDuration('');
			setTime('');
			setDate('');
			setMessage('');
		}

		catch(err){
			setMessage(err.response?.data?.message || "Something went wrong");
		}
	};

  return(
    <h1>MyMeetings</h1>
  );
} export default MyMeetings;