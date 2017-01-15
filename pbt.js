const eventEmitter = require('events').EventEmitter;
const emitter = new eventEmitter();
const outputStream = process.stderr;
const ansi = require('ansi');
const cursor = ansi(process.stdout);

// colors
const defaultColors = {
  red: "#e63900",
  green: "#00b300",
  yellow: "#ffff00"
};

// defaults

const defaultStartMsg = '<';
const defaultEndMsg = '>';
const defaultTtyDefaultWidth = 100;

// Utils
function setBarMsg(startMsg) {
	return `${defaultStartMsg || startMsg}`;
}

function calcProgressChars(msg) {
	return (msg.progress * 100) / defaultTtyDefaultWidth;
}


/**
 * draw the next char on the progress bar
 * @param {Object} bar
 * @param {Object} msg The progress in percentage
 */
function draw(barProps, msg) {
	// calculate how many chars we need
	// write to stream with the specified output
	const numberOfChars = calcProgressChars(msg);
	for(var i = 0; i < numberOfChars; i++) {
		cursor.goto(1, barProps.y)
		.hex(msg.color)
		.write(msg.text);
	}
	barProps.y += numberOfChars;
}

/** 
 * Always holds the last cursor position
 */
function bar(barProps) {
	cursor.fg.reset();

	const props = {} || barProps;

	// The props are considered a msg, which is converted to a js plain object
	function update(progress, text, color) {
		draw(props, {progress: progress, text: text, color: color || defaultColors.yellow, end: false});
	}

	// The props are considered a msg, which is converted to a js plain object
	function end(progress, text, color) {
		draw(props, {progress: progress, text: text, color: color || defaultColors.green, end: true});
	}

	// The props are considered a msg, which is converted to a js plain object
	function error(progress, text, color) {
		draw(props, {progress: progress, text: text, color: color || defaultColors.red, end: false});
	}

	// bar api
	return {
		update: update,
		end: end
	}
}

/**
 * Creates a new bar on the terminal
 * @param {Number} progress in percentage range from 0-100
 * @param {String} 
 */ 
function spawn(callback) {
	callback(bar({x: 0, y: 0}));
}

module.exports = {
	spawn: spawn
};
