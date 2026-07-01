import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion } from 'framer-motion';
import { IconArrowLeft } from "@tabler/icons-react";
import './Signup.css';

function Signup() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
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

	const handleSignup = async() => {
		if (!username || !password || !email) {
			setMessage('All fields are required');
			return;
		}

		try {
			await axios.post('http://localhost:5000/api/users/signup', {
				username: username.trim(),
				email: email.trim(),
				password: password
			});

			navigate('/');
		}

		catch(err) {
			console.log(err);
			setMessage(err.response?.data?.message || "Something went wrong");
		}
	}

	return(
		<div className="container">
			<h1 className="title">{dispText}</h1>
			{showForm && (
				<div>
					<div className="signup_box">
						<button onClick={() => navigate('/')} className="back_btn"><IconArrowLeft size={20}></IconArrowLeft></button>
						<div className="create_acc">Create your account</div>
						<input type="text" placeholder="Username" className="inp_box" value={username} onChange={(e) => setUsername(e.target.value)} />
						<input type="email" placeholder="Email" className="inp_box" value={email} onChange={(e) => setEmail(e.target.value)} />
						<input type="password" placeholder="Password" value={password} className="inp_box"
							onKeyDown={(e) => e.key === 'Enter' && handleSignup()} onChange={(e) => setPassword(e.target.value)} />
						{message && <h4>{message}</h4>}
						<div className="btn_box">
							<button onClick={handleSignup}>Sign up</button>
							<button onClick={() => navigate('/')}>Cancel</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
export default Signup;
