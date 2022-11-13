const express = require('express');
var app = require('express')();

var server = require('http').Server(app);
var io = require('socket.io')(server);

//Inicio de servidor
app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), () => console.log('Servidor iniciado en 3000'));

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'public');
});

io.on('connection', (socket) => {
  console.log('socket conectado', socket.id);
  io.emit('socket_conectado',
    'Nuevo socket conectado: '
    +socket.id+'<br>');

  socket.on('disconnect', () => {
    console.log('socket desconectado', socket.id);
    io.emit('socket_desconectado', {
      texto: 'Socket desconectado.',
      id: socket.id,
    });
  });

  socket.on('chat:mensaje', (data) => {
    io.emit('chat:mensaje', data);
  });

  socket.on('chat:escribiendo', (usuario) => {
    socket.broadcast.emit('chat:escribiendo', usuario);
  });
});