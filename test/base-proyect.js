window.ponyExpress = new PonyExpress({
	io : "http://localhost:3000"
});

$(document).ready(function () {
	window.messagePlug = new PonyExpress.Plug({
		name : "message",
		events : ['move'],
		onMove : function(data){
			if(!data.id){
				throw "PonyExpress Items need id";
			}
		}
	});
})
