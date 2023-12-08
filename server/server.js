const { pid } = require('process');

const io = require('socket.io')(4000, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

const connectedClient = {};

const publicMessages = [];
const privateMessages = [];

io.on('connection', (socket) => {
  socket.on('authenticate', (userName) => {
    if (userName) {
      connectedClient[userName] = socket.id;
    }
    io.emit('usersList', Object.keys(connectedClient));
    socket.emit('publicHistory', publicMessages);
  });

  socket.on('publicMessage', (message) => {
    if (message) {
      const userName = Object.keys(connectedClient).find(
        (user) => connectedClient[user] === socket.id
      );

      const data = {
        message,
        userName,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      if (userName) {
        publicMessages.push(data);
      }

      io.emit('publicMessage', data);
    }
  });

  socket.on('privateMessage',({to,message})=>{
    const from = Object.keys(connectedClient).find(user=>connectedClient[user]===socket.id)

    const privateMessage = {
      data : message,
      from,
      to,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    privateMessages.push(privateMessage)
    console.log(privateMessage);
    io.to(connectedClient[to]).emit('privateMessage',privateMessage)
    if(from !== to){
      socket.emit('privateMessage',privateMessage)
    }
    
  })


  socket.on('disconnect', () => {
    const disconnectedUserName = Object.keys(connectedClient).find(
      (user) => connectedClient[user] === socket.id
    );

    delete connectedClient[disconnectedUserName];
    io.emit('usersList', Object.keys(connectedClient));
  });
});
