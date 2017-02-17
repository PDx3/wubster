var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.get('/room/:id', function (request, response) {
    var roomId = request.params.id;
    console.log(roomId);
    response.render('pages/room', {roomId: roomId});
});

app.get('/db', function (request, response) {
    response.render('pages/db');
});

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

io.on('connection', function (socket) {
    io.emit('broadcast', {vId: 'qycqF1CWcXg'});
    socket.on('chat message', function (msg) {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        console.log('Now: ' + now);
        console.log('H' + hours);
        console.log('M' + minutes);
        var formattedTimestamp = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
        io.emit('chat message', {message: msg, timestamp: formattedTimestamp});
    });
});

http.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});