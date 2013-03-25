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

app.use(express.bodyParser());
app.use(express.cookieParser());

app.use(express.static('../'));

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/backbone', function (req, res) {
	res.render('backbone');
});

app.post('/mirror', function (req, res){
	req.body.data.id = req.body.data.id || 1;

	io.sockets.emit(req.body.type + '::' + req.body.action, req.body.data);

	res.send(200,{status : "Ok"});
});

var connection = function(socket){}

io.sockets.on('connection', connection);
