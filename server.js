const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8026;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle slideshow updates
    socket.on('slideChange', (data) => {
        // Broadcast to all other clients
        socket.broadcast.emit('slideChange', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
