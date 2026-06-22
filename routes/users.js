const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { use } = require('react');

//Sending username to server
router.post('/login', async (requestAnimationFrame,res) => {
  try{
		const {username} = req.body;

		if (!username || username.trim() === ""){
			return res.status(400).json({message : "Username is required"});
		}

		//without any extra spaces
		const cleanUsername = username.trim();
		//checking if user already exists
		let user = await User.findOne({username : cleanUsername});

		//if exists
		if (user){
			return res.status(200).json({message: "Welcome back!", user});
		}

		//username not existing
		user = new User({username : cleanUsername});
		await user.save();
		return res.status(201).json({message : "Account created"});
  }

	catch(err){
		res.status(500).json({message : "Can't login"})
	}
});