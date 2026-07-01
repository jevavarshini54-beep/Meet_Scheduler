const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const signup = async(req, res) => {
	try {
		const {username, email, password} = req.body;

		if (!username || !password || !email) {
			return res.status(400).json({message: "All fields are required"});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({message: "Please enter a valid email"});
		}

		const existingUser = await User.findOne({email});
		if (existingUser) {
			return res.status(400).json({message: "Email already registered"});
		}

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password,salt);
		const user = await User.create({
			username, email,
			password: hashedPassword
		});

		return res.status(201).json({message: "User created successfully",
			user: {
				_id: user._id,
				name: user.username,
				email: user.email
			}});
	}

	catch(err) {
		res.status(500).json({message: err.message});
	}
};

const login = async(req, res) => {
};

const logout = async(req, res) => {
};

module.exports = {signup, login, logout};