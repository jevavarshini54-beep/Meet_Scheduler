import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'
import './Login.css';

function Login({setCurrentUser}){

	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	
	const fullText = "Meeting Scheduler";
	const [dispText, setDispText] = useState('');
	const [showForm, setShowForm] = useState(false);
	useEffect(() => {
		let index = 0;
		const timer = setInterval(() => {
			if (index<fullText.length){
				setDispText(fullText.slice(0,index+1));
				index++;
			}

			else{
				clearInterval(timer);
				setTimeout(() => setShowForm(true),100);
			}
		}, 100);
		return () => clearInterval(timer);
	},[]);

	const handleLogin = async() => {
		console.log('login function check');
		if (!email || !password){
			setMessage('All fields are required');
			return;
		}

		try{
			const response = await axios.post('http://localhost:5000/api/users/login', {
				email: email.trim(),
				password: password
			});

			console.log("About to set token, value is:", response.data.token);
			sessionStorage.setItem('token', response.data.token);
			console.log("Token in storage right after setting:", sessionStorage.getItem('token'));
			setCurrentUser(response.data.user);
			navigate('/home');
		}

		catch(err){
			console.log(err);
			setMessage(err.response?.data?.message || "Something went wrong");
		}
	}

	return(
		<div className='container'>
			<h1 className='title'>{dispText}</h1>
			{showForm && (
				<motion.div className='login_box' initial={{opacity: 0, y: 40, scale: 0.95}}
					animate={{opacity: 1, y: -20, scale: 1}} transition={{ease: "easeInOut", duration: 2}}>
					<h3>Enter your username to proceed</h3>
					<input type="text" placeholder='Email' value={email} className='name'
						onChange={(e) => setEmail(e.target.value)} />
					<input type="text" placeholder='Password' value={password} className='name'
						onKeyDown={(e) => e.key === 'Enter' && handleLogin()} onChange={(e) => setPassword(e.target.value)} />
					<motion.button onClick={handleLogin} whileHover={{scale: 0.95, y: -3, transition: {type: "spring", stiffness: 200, damping: 17}}}
						whileTap={{scale: 0.95, y: 0, transition: {type: "spring", stiffness: 200, damping: 17}}}><h3>Login</h3></motion.button>
					<h4 className='no_account'>Don't have an account? <Link to='/signup' className="signup_link">Signup</Link></h4>

					{message && <p className='invalid_name'>{message}</p>}
				</motion.div>
			)}
		</div>
	)
} export default Login;