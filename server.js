const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8026;

// Storage for vote counts by vote name
const voteCounters = {};

// Middleware for parsing JSON
app.use(express.json());

// Serve static files from the public folder
app.use(express.static('public'));

// POST endpoint for submitting votes
app.post('/submit', (req, res) => {
	const { name, option } = req.body;

	if (!name || !option) {
		return res.status(400).json({ error: 'Name and option are required' });
	}

	// Initialize vote counter for this vote if it doesn't exist
	voteCounters[name] ??= {};

	// Increment vote count for the selected option
	voteCounters[name][option] ??= 0;
	voteCounters[name][option]++;

	// Calculate total votes for this vote
	const totalVotes = Object.values(voteCounters[name]).reduce((sum, count) => sum + count, 0);

	// Broadcast updated vote counts to all connected clients
	io.emit('voteUpdate', {
		name,
		counts: voteCounters[name],
		total: totalVotes
	});

	console.log(`Vote received for ${name}: ${option}. New total: ${totalVotes}`);
	res.json({ success: true, total: totalVotes });
});

// Socket.IO connection handling
io.on('connection', socket => {
	console.log('A user connected');

	// Send current vote counts when user connects
	socket.emit('allVoteCounts', voteCounters);

	socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
