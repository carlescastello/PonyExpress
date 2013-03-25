Te.suite('Pony Express')(function() {
	this.describe('1.- Pony Express Backbone')(function() {
		this.specify('Basic Classes')(function(spec) {
		 	spec.assert( !!PonyExpress ).toBe( true );
            spec.assert( !!PonyExpress.BackbonePlug ).toBe( true );
            spec.assert( !!Backbone ).toBe( true );

		 	spec.completed();
		});

		this.specify('Basic Proyect')(function(spec) {
			spec.assert( !!window.ponyExpress ).toBe( true );
			spec.assert( !!window.messagePlug ).toBe( true );
			spec.assert( !!window.messageCollection ).toBe( true );

		 	spec.completed();
		});
	});

	this.describe('2.- Pony Express Backbone Add Binding')(function() {
		this.specify('Create binding')(function(spec){
			window.messageCollection.bind('add',function(data){
				var item = window.messageCollection.first();

				spec.assert( window.messageCollection.length ).toBe( 1 );
				spec.assert( item.get('status') ).toBe( "created" );

				spec.completed();
			});

			$.post('/mirror',{
				type   : 'message',
				action : 'create',
				data   : {
					status : 'created'
				}
			});
		});
	});

	this.describe('3.- Pony Express Backbone Update Binding')(function() {
		this.specify('Update binding')(function(spec){
			window.messageCollection.bind('change',function(data){
				spec.assert( data.get('status')  ).toBe( "updated" );
				spec.assert( data.get('content') ).toBe( "missing" );

				spec.completed();
			});

			$.post('/mirror',{
				type   : 'message',
				action : 'update',
				data   : {
					status  : 'updated',
					content : 'missing'
				}
			});
		});
	});

	this.describe('4.- Pony Express Backbone Remove Binding')(function() {
		this.specify('Delete binding')(function(spec){
			setTimeout(function(){
				window.messageCollection.bind('remove',function(data){
					spec.assert( data.get('id')  ).toBe( 1 );
					spec.assert( window.messageCollection.length ).toBe( 0 );

					spec.completed();
				});

				$.post('/mirror',{
					type   : 'message',
					action : 'delete',
					data   : {
						status : 'deleted'
					}
				});
			},500);
		});			
	});

	this.describe('5.- Pony Express Additional Bindings')(function() {
		this.specify('Move binding')(function(spec){

			window.messagePlug.bind('move',function(data){
				spec.assert( data.status ).toBe( "moved" );
				spec.completed();
			});
			
			$.post('/mirror',{
				type   : 'message',
				action : 'move',
				data   : {
					status : 'moved'
				}
			});
		});			
	});
});