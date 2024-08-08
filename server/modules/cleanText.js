const fs = require('fs');

fs.readFile('../data/text/soft/diy.txt', 'utf8', (err, data) => {
	const pattern = /\w*\s?[\.|?]/gi;

	match = data.match(pattern);
	if (match) {
		//console.log(match);
	}
});
