const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
	// copy existing Mongoose error object in to new error Object
	let error = { ...err };
	error.message = err.message;

	// Mongoose erro bad ObjectId
	if (err.name === 'CastError') {
		const message = `Resource not found with id of ${err.value} `;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose error duplicate key
	if (err.code === 11000) {
		const message = `Duplicate field value entered.`;
		error = new ErrorResponse(message, 400);
	}

	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map(value => value.message);
		error = new ErrorResponse(message, 400);
	}

	res
		.status(error.statusCode || 500)
		.json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
