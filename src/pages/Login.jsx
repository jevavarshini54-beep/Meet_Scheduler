import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({setCurrentUser}){

	const [username,setUsername] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	
	const fullText = "Meeting Scheduler";

	const handleLogin = async() => {
		if (!username.trim()){
			setMessage("Please enter a valid username");
			return;
		}

		try{
			const response = await axios.post('http://localhost:5000/api/users/login', {
				username: username.trim()
			});

			setCurrentUser(response.data.user);
			navigate('/home');
		}

		catch(err){
			console.log(err);
			setMessage("Something went wrong");
		}
	}

	return(
		<div>
			<h1>Meeting Scheduler</h1>
			<h3>Enter your username to proceed</h3>
			<input type="text" placeholder='Enter username...' value={username}
				onKeyDown={(e) => e.key === 'Enter' && handleLogin()} onChange={(e) => setUsername(e.target.value)} />
			<button onClick={handleLogin}>Click to proceed</button>

			{message && <p>{message}</p>}
		</div>
	)
} export default Login;