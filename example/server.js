/* Importar librerias */
var express  = require('express'),
	app      = express(),
	server   = require('http').createServer(app),
	io       = require('socket.io').listen(server),
	swig     = require('swig'),
	cons     = require('consolidate'),
	uuid     = require('node-uuid'),
	messages = [];
/* Escucho por puerto 3000 */
server.listen(3000);
console.log('visit http://localhost:3000 for simple example \nvisit http://localhost:3000/backbone for backbone example');

/* Quito cache de swig */
swig.init({
	cache : false
});

/* Arreglo de mensajes */
var messages = [];

/* Coloco engine con swig */
app.engine('.html', cons.swig);
app.set('view engine', 'html');

/* Establesco carpeta estatica */
app.use(express.static('../'));

/* Habilito solicitudes POST */
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());

/* GET a / */
app.get('/', function (req, res) {
	res.render('index');
});

/* GET de /Backbone */
app.get('/backbone', function (req, res){
	res.render('backbone');
});

/* POST de mensajes enviados */
app.post('/messages', function (req, res){
	req.body.id = uuid.v1();
	console.log('body', req.body);

	messages.push(req.body);

	io.sockets.emit('message::create', req.body);

	res.send(200, {status:"Ok"});
});

/* Delete para cada id de messages */
app.delete('/messages/:id', function (req, res){
	var message;

	for (var i = messages.length - 1; i >= 0; i--) {
		message = messages[i];

		if(message.id === req.params.id){
			messages.splice(i,1);
		}
	};

	io.sockets.emit('message::delete', {id:req.params.id});

	res.send(200, {status:"Ok"});
});


/* POST de Backbone hacia el id de cada mensaje */
app.put('/messages/:id', function (req, res){
	var message;

	for (var i = messages.length - 1; i >= 0; i--) {
		message = messages[i];

		if(message.id === req.params.id){
			messages[i] = req.body;
		}
	};

	io.sockets.emit('message::update', req.body);

	res.send(200, {status:"Ok"});
});

/* GET a messages */
app.get('/messages', function (req, res) {
	res.send(messages);
});

/* Establece eventos create delete y update para cada mensaje en cada socket */
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

/* Inicio Clientes Fake */
var Faker    = require('Faker'),
	ioClient = require('socket.io-client'),
	socket   = ioClient.connect('http://localhost:3000'),
	lastMessage, lastMessage2;


setInterval(function(){
	if(Math.random() > 0.3){
		lastMessage.highlight = true;

		socket.emit('message::update', lastMessage);
	}
},5000);

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
/* Fin Clentes Fake */
