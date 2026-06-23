const express = require('express')
const router = express.Router()
const Meeting = require('../models/Meeting')
const Space = require('../models/Space')
const User = require('../models/User')

//Create a meeting
router.post('/create', async (req,res) => {
	try{
		const {title, description, startTime, duration, spaceId, userId} = req.body;
		if (!title, description, startTime, duration, spaceId, userId){
			return res.status(400).json({messgae : "All fields are required"});
		}

		const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({message : "Space not found"});
    }

    if (!space.members.includes(userId)) {
      return res.status(403).json({message : "You are not a member of this space"});
    }

		const meeting = new Meeting ({
			title, description, startTime, duration,
			spaceId, createdBy: userId
		});
		await meeting.save();
		res.status(201).json({message : "Meeting created!"});
	}

	catch(err){
		res.status(500).json({messgae : "Something went wrong"});
	}
});

// Get all meetings in a space
router.get('/space/:spaceId', async (req,res) => {
	try{
		const meetings = await Meeting.find({spaceId: req.params.spaceId})
			.populate('createdBy','username')
			.sort({startTime: 1});
		res.status(200).json({meetings});
	}

	catch(err){
		res.status(500).json({message : "Something went wrong"});
	}
});

// Delete a meeting (only by the creator)
router.delete('/:id', async (req,res) => {
	try{
		const {userId} = req.body;
		const meeting = await Meeting.findById(req.params.id);

		if (!meeting){
			res.status(404).json({message : "Meeting not found"});
		}

		//only creator can delete
		if (meeting.createdBy.toString() !== userId){
			return res.status(400).json({message : "Only the creator can delete the message"});
		}

		await Meeting.findByIdAndDelete(req.params.id);
		res.status(200).json({messgae : "Deleted successfully"});
	}

	catch(err){
		res.status(200).json({message : "Something went wrong"});
	}
});

router.get('/user/userId', async (req,res) => {
	try{
		const user = User.findById(req.params.userId).populate('spaces');
		if (!user){
			return res.status(404).json({message : "User not found"});
		}
		const spaceIds = user.spaces.map(space => space._id);

    const meetings = await Meeting.find({spaceId: {$in: spaceIds}})
      .populate('createdBy', 'username')
      .populate('spaceId', 'name code')
      .sort({startTime: 1});

    res.status(200).json({meetings});
	}

	catch(err){
		res.status.json({message : "Something went wrong"});
	}
});

module.exports = router;