var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');
let UsersListArray = [];


app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

var typing = false;
var timeout = undefined;
var name;
var users = [];
var LoggedInUser;
io.on('connection', (socket) => {
    console.log('new user connected');
    
    socket.on('joining msg', (username) => {
        name = username;
        io.emit('chat message', `---${name} joined the chat---`);
        users.push({
            id: socket.id,
            username: username
        });
       // console.log("Active Users", users);
        //const LogUser = users.find(user => user.id == socket.id);
       // console.log("LogInUser", LogUser.username);
      //  console.log("Total Users:", users);

       // LoggedInUser = users.filter(function (user) { return user.id != LogUser.id });
       //console.log(LoggedInUser);

        io.emit('user status', `${JSON.stringify(users)}`);

        
    });

    socket.on('typing', (data) => {
        if (data.typing == true)
            io.emit('display', data)
        else
            io.emit('display', data)
        console.log(data);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        //console.log(name);
        //name = username;
        const DisconnectedUser = users.find(user => user.id == socket.id);
       console.log("Disconnected User:", DisconnectedUser);
        io.emit('chat message', `---${DisconnectedUser.username} left the chat---`);
       // console.log("Total Users:",users);
        users = users.filter(function (user) { return user.id != DisconnectedUser.id });
       
        io.emit('user offline status', `${DisconnectedUser.username}`);
        io.emit('user status', `${JSON.stringify(users)}`);

    });
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg); 
    });
});

server.listen(process.env.PORT || 5000, () => {
     console.log('Server listening on :5000');
});


