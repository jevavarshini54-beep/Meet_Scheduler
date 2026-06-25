const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const User = require('../models/User');

//creating a new meet-space
router.post('/create', async (req,res) => {
	try{
		const {name,userId} = req.body;
		if (!name || !userId){
			return res.status(400).json({message: "Name, UserId not found"});
		}

		const space = new Space({
      		name,
      		createdBy: userId,
      		members: [userId]  //creator is automatically a member
    	});
		await space.save();

		await User.findByIdAndUpdate(userId, {
			$push: {spaces: space._id}
		});
		res.status(201).json({message : 'Space created', space});
	}

	catch(err){
		res.status(500).json({message : "Space not created"})
	}
})

//Joining a meet-space
router.post('/join_meetspace', async (req,res) => {
	try{
		const {userId, code} = req.body;
		if (!code || !userId){
			return res.status(400).json({message : "Code and userId not found"});
		}

		const space = await Space.findOne({code : code});
		if (!space){
			return res.status(404).json({message : "Space not found.....check meet-code"});
		}

		//if already a member
		if (space.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already in this space!' });
    }

		space.members.push(userId);
    await space.save();

    await User.findByIdAndUpdate(userId, {
      $push: { spaces: space._id }
    });

    res.status(200).json({ message: 'Joined successfully!', space });
	}

	catch(err){
		res.status(500).json({ message: 'Something went wrong' });
	}
});

// all spaces of one user
router.get('/user/:userId', async (req,res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('spaces');

    if (!user) {
      return res.status(404).json({message : 'User not found'});
    }

    res.status(200).json({spaces : user.spaces});

  }
	
	catch (err){
    res.status(500).json({ message: 'Something went wrong' });
  }
});

//one space with all its members
router.get('/:id', async (req,res) => {
	try{
		const space = await Space.findById(req.params.id)
			.populate('members','username')
			.populate('createdBy','username');
		if(!space){
			return res.status(404).json({message : "Space not found"});
		}
		res.status(200).json({space});
	}

	catch(err){
		res.status(500).json({message : "Something went wrong"});
	}
});

module.exports = router;