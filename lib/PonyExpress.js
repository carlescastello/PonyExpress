Class('PonyExpress').includes(CustomEventSupport)({
	capitalise : function(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	prototype : {
		_io : null, //Socket Io Connection
		init : function (config) {
			console.log('connection to:', config.io);
			var ponyExpress = this;

			this._io = io.connect(config.io);

			this._io.on('connect', function(data){
				ponyExpress.connected = true;
				ponyExpress.dispatch('connect');
			});
		}
	}
});