const mongoose = require('mongoose')
<<<<<<< HEAD

=======
 
>>>>>>> 5390a677b61bfef6043c47f93f4d2d549b85a8a1
const meetingSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
<<<<<<< HEAD

	description: {
		type: String
	},

=======
 
	description: {
		type: String,
        requied: false
	},
 
>>>>>>> 5390a677b61bfef6043c47f93f4d2d549b85a8a1
	startTime: {
		type: Date,
		required: true
	},
<<<<<<< HEAD

=======
 
>>>>>>> 5390a677b61bfef6043c47f93f4d2d549b85a8a1
	duration: {
		type: Number,
		required: true // in mins
	},
<<<<<<< HEAD

=======
 
>>>>>>> 5390a677b61bfef6043c47f93f4d2d549b85a8a1
	spaceId: {
		type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true
	},
<<<<<<< HEAD

=======
 
>>>>>>> 5390a677b61bfef6043c47f93f4d2d549b85a8a1
	createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps : true});
<<<<<<< HEAD

module.exports = mongoose.model('Meeting',meetingSchema);
=======
 
module.exports = mongoose.model('Meeting',meetingSchema);
 
>>>>>>> 5390a677b61bfef6043c47f93f4d2d549b85a8a1
