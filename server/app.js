const Koa = require('koa');
const path = require('path');
const static = require('koa-static');

const app = new Koa();
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);

var clients = [];


app.use(static(
    path.join(__dirname, './public')
));

server.listen(4002, () => {
    console.log('连接成功');
});

let count = 0;

let countUser = {};

io.on('connection', socket => {
    
    socket.on('login', function (msg) {
        countUser[msg.username] = msg.id;
        count++;
        io.emit('login', { count, username: msg.username  });
    });

    socket.on('logout', function (msg) {
        delete countUser[msg.username];
        count--;
        socket.broadcast.emit('logout', { username: msg.username, count  });
    });

    socket.on('message', function (msg) {
        socket.broadcast.emit('message', { username: msg.nickName, message: msg.message  });
    });
})