var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	console.log(request);
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
     io.emit('chat message', msg);
  });
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});