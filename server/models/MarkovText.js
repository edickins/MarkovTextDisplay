const mongoose = require('mongoose');

const MarkovText = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name.'],
			unique: [true, 'Name must be unique.'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Please add a description.'],
			trim: true,
		},
		tags: {
			type: Array,
			required: [true, 'Please add tags.'],
			lowercase: true,
		},
		sentences: {
			type: Array,
			required: [true, 'Please add sentences.'],
		},
		dateCreated: { type: Date, default: Date.now },
	},
	{
		query: {
			byTags(tag) {
				return this.where({ tags: new RegExp(tag, 'i') });
			},
		},
	}
);

module.exports = mongoose.model('seeds', MarkovText);
