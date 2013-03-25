var express  = require('express'),
	app      = express(),
	server   = require('http').createServer(app),
	io       = require('socket.io').listen(server),
	swig     = require('swig'),
	cons     = require('consolidate'),
	uuid     = require('node-uuid'),
	messages = [];

server.listen(3000);

swig.init({
	cache : false
});

var messages = [];

app.engine('.html', cons.swig);
app.set('view engine', 'html');

app.use(express.static('../'));

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/backbone', function (req, res){
	res.render('backbone');
});

app.post('/messages', function (req, res){
	req.body.id = uuid.v1();
	console.log('body', req.body);

	messages.push(req.body);

	io.sockets.emit('message::create', req.body);

	res.send(200, {status:"Ok"});
});

app.delete('/messages/:id', function (req, res){
	var message;

	for (var i = messages.length - 1; i >= 0; i--) {
		message = messages[i];

		if(message.id === req.params.id){
			messages.splice(i,1);
		}
	};

	res.send(500, {status:"Fail"});
});

app.get('/messages', function (req, res) {
	console.log('===> messages', messages.length );
	res.send(messages);
});

console.log(app.routes);

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

return;

// Fake client
var Faker    = require('Faker'),
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
