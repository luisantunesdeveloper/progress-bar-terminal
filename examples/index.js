const pbt = require('../');

pbt.spawn((bar) => {

	setInterval(() => {
		bar.update(1, '-');
	}, 1000);
	
});