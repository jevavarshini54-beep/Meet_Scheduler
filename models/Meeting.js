const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},

	description: {
		type: String
	},

	startTime: {
		type: Date,
		required: true
	},

	duration: {
		type: Number,
		required: true // in mins
	},

	spaceId: {
		type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true
	},

	createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps : true});

module.exports = mongoose.model('Meeting',meetingSchema);