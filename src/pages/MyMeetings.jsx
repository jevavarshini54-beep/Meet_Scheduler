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

  return(
    <h1>MyMeetings</h1>
  );
} export default MyMeetings;