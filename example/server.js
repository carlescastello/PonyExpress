var express  = require('express'),
	app      = express(),
	server   = require('http').createServer(app),
	io       = require('socket.io').listen(server),
	swig     = require('swig'),
	cons     = require('consolidate'),
	messages = [];

server.listen(3000);

swig.init({
	cache : false
});

var messages = [];

app.engine('.html', cons.swig);
app.set('view engine', 'html');

app.use(express.static('../'));

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/messages', function (req, res) {
	console.log('===> messages', messages.length );
	res.send(messages);
});

var connection = function(socket){		
	socket.on('message::create', function(data){
		messages.push(data);

		socket.broadcast.emit('message::create', data);
	});

	socket.on('message::delete', function(data){
		socket.broadcast.emit('message::delete', data);
	});

	socket.on('message::update', function(data){
		socket.broadcast.emit('message::update', data);
	});
}

io.sockets.on('connection', connection);

// Fake client
var Faker    = require('Faker'),
	uuid     = require('node-uuid'),
	ioClient = require('socket.io-client'),
	socket   = ioClient.connect('http://localhost:3000'),
	lastMessage, lastMessage2;

setInterval(function(){
	if(Math.random() > 0.3){
		lastMessage.text = Faker.Lorem.sentence();

		socket.emit('message::update', lastMessage);
	}
},2000);

setInterval(function(){
	if(Math.random() > 0.3){
		socket.emit('message::delete', lastMessage2);
	}
},3600);

setInterval(function(){
	lastMessage2 = lastMessage;

	lastMessage = {
		id   : uuid.v1(),
		user : Faker.Name.findName(),
		text : Faker.Lorem.sentence()
	};

	socket.emit('message::create', lastMessage);
},1000);
