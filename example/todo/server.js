/* Importar librerias */
var express  = require('express'),
	app      = express(),
	server   = require('http').createServer(app),
	io       = require('socket.io').listen(server),
	swig     = require('swig'),
	cons     = require('consolidate'),
	uuid     = require('node-uuid'),
	ToDoTask = [];
/* Escucho por puerto 3000 */
server.listen(3000);
console.log('visita http://localhost:3000 para ver el ToDo');

/* Quito cache de swig */
swig.init({
	cache : false
});

/* Arreglo de mensajes */
var ToDoTask = [];

/* Coloco engine con swig */
app.engine('.html', cons.swig);
app.set('view engine', 'html');

/* Establesco carpeta estatica */
app.use(express.static('./static'));

/* Habilito solicitudes POST */
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());

/* GET a / */
app.get('/', function (req, res) {
	res.render('index');
});


/* POST de mensajes enviados */
app.post('/ToDoTask', function (req, res){
	req.body.id = uuid.v1();
	console.log('body', req.body);

	ToDoTask.push(req.body);

	io.sockets.emit('ToDoList::create', req.body);

	res.send(200, {status:"Ok"});
});

/* Delete para cada id de ToDoTask */
app.delete('/ToDoTask/:id', function (req, res){
	var ToDoList;

	for (var i = ToDoTask.length - 1; i >= 0; i--) {
		ToDoList = ToDoTask[i];

		if(ToDoList.id === req.params.id){
			ToDoTask.splice(i,1);
		}
	};

	io.sockets.emit('ToDoList::delete', {id:req.params.id});

	res.send(200, {status:"Ok"});
});


/* POST de Backbone hacia el id de cada mensaje */
app.put('/ToDoTask/:id', function (req, res){
	var ToDoList;

	for (var i = ToDoTask.length - 1; i >= 0; i--) {
		ToDoList = ToDoTask[i];

		if(ToDoList.id === req.params.id){
			ToDoTask[i] = req.body;
		}
	};

	io.sockets.emit('ToDoList::update', req.body);

	res.send(200, {status:"Ok"});
});

/* GET a ToDoTask */
app.get('/ToDoTask', function (req, res) {
	res.send(ToDoTask);
});

/* Establece eventos create delete y update para cada mensaje en cada socket */
var connection = function(socket){		
	socket.on('ToDoList::create', function(data){
		ToDoTask.push(data);

		socket.broadcast.emit('ToDoList::create', data);
	});

	socket.on('ToDoList::delete', function(data){
		socket.broadcast.emit('ToDoList::delete', data);
	});

	socket.on('ToDoList::update', function(data){
		socket.broadcast.emit('ToDoList::update', data);
	});
}

io.sockets.on('connection', connection);

/* Inicio Clientes Fake */
/*var Faker    = require('Faker'),
	ioClient = require('socket.io-client'),
	socket   = ioClient.connect('http://localhost:3000'),
	lastMessage, lastMessage2;


setInterval(function(){
	if(Math.random() > 0.3){
		lastMessage.highlight = true;

		socket.emit('ToDoList::update', lastMessage);
	}
},5000);

setInterval(function(){
	if(Math.random() > 0.3){
		socket.emit('ToDoList::delete', lastMessage2);
	}
},10);

setInterval(function(){
	lastMessage2 = lastMessage;

	lastMessage = {
		id   : uuid.v1(),
		user : Faker.Name.findName(),
		text : Faker.Lorem.sentence()
	};

	socket.emit('ToDoList::create', lastMessage);
},1000);*/
/* Fin Clentes Fake */
