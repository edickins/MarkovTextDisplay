const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 5000,
		});

		console.log(
			`mongoDB connected : ${conn.connection.host}`.cyan.underline.bold
		);
	} catch (error) {
		console.log(`mongoDB connection failed ${error}`);
	}
};

module.exports = connectDB;
