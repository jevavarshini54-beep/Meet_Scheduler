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

		const existingUserName = await User.findOne({username});
		if (existingUserName) {
			return res.status(400).json({message: "Username already exists"});
		}

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

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password,salt);
		const user = await User.create({
			username, email,
			password: hashedPassword
		});

		return res.status(201).json({message: "User created successfully",
			user: {
				_id: user._id,
				username: user.username,
				email: user.email
			}
		});
	}

	catch(err) {
		res.status(500).json({message: err.message});
	}
};

const login = async(req, res) => {
	try {
		const {email, password} = req.body;

		if (!email || !password) {
			return res.status(400).json({message: "All fields are required"});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({message: "Please enter a valid email"});
		}

		const user = await User.findOne({email});
		if (!user) {
			return res.status(400).json({message: "Email id doesn't exist"});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({message: "Invalid credentials"})
		};

		const token = jwt.sign(
			{id: user._id},
			process.env.JWT_SECRET,
			{expiresIn: "30m"}
		);

		if (!token) {
			return res.status(400).json({message: "Token not created"});
		}

		res.status(200).json({message: "Login successful",
			token, user: {
				_id: user._id,
				email: user.email,
				username: user.username
			}
		});
	}

	catch {
		return res.status(400).json({message: "Unsuccessful login"});
	}
};

const logout = async(req, res) => {
	return res.status(200).json({message: "Logout successful"});
};

module.exports = {signup, login, logout};