const { pid } = require('process');

const io = require('socket.io')(4000, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

const connectedClient = {};

const publicMessages = [];

io.on('connection', (socket) => {
  socket.on('authenticate', (userName) => {
    if (userName) {
      connectedClient[userName] = socket.id;
    }
    console.log(connectedClient);
    io.emit('usersList', Object.keys(connectedClient));
  });

  socket.on('publicMessage', (message) => {
    if (message) {
      const userName = Object.keys(connectedClient).find(
        (user) => connectedClient[user] === socket.id
      );

      const data = { message, userName };
      publicMessages.push(data);
      console.log(data);
      io.emit('publicMessage', data);
    }
  });

  socket.on('disconnect', () => {
    const disconnectedUserName = Object.keys(connectedClient).find(
      (user) => connectedClient[user] === socket.id
    );

    delete connectedClient[disconnectedUserName];
    io.emit('usersList', Object.keys(connectedClient));
  });
});
