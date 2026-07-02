const mongoose = require('mongoose');

//random meet-code
function generateCode(){
    return Math.random().toString(36).substring(2,8).toUpperCase();
}

const spaceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},

	code: {
		type: String,
		unique: true,
		default: generateCode
	},

	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	
	members: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
}, {timestamps : true});

module.exports = mongoose.model('Space', spaceSchema)