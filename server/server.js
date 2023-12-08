const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Allow requests from the Next.js frontend domain
app.use(cors({ origin: '*' }));

io.on('connection', (socket) => {
  
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Socket server running on port ${port}`);
});
