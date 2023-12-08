const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});


const connectedClient = {}

io.on('connection', (socket) => {
  socket.on('authenticate',(userName)=>{
    if(userName){
      connectedClient[userName] = socket.id
    }
    console.log(connectedClient);
    io.emit('usersList',Object.keys(connectedClient))
  })
});

