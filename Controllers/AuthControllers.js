const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const signup = async(req, res) => {
	try {
		const {username, email, password} = req.body;

		if (password.length < 8){
			return res.status(400).json({message: "Password must be atleast 8 characters"});
		}

		const hasLetter = /[a-zA-Z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		const hassplChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		if (!hasLetter) {
			return res.status(400).json({message: "Password must contain an alphabet"});
		}

		if (!hasNumber) {
			return res.status(400).json({message: "Password must contain a number"});
		}

		if (!hassplChar) {
			return res.status(400).json({message: "Password must contain a special character"});
		}

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