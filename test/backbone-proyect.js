window.ponyExpress = new PonyExpress({
	io : "http://localhost:3000"
});

window.MessageCollection =  Backbone.Collection.extend({
	name : "message"
});

window.messageCollection = new MessageCollection();

$(document).ready(function () {

	window.messagePlug  = new PonyExpress.BackbonePlug({
		events : ['move'],
		onMove : function(data){
			console.log('moved');
		},
		collection : window.messageCollection
	});

	// window.messagePlug = new PonyExpress.Plug({
	// 	name : "message",
	// 	events : ['move'],
	// 	onMove : function(data){
	// 		if(!data.id){
	// 			throw "PonyExpress Items need id";
	// 		}
			
	// 		this.dispatch('move', data);
	// 	}
	// });
})
