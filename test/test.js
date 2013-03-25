Te.suite('Pony Express')(function() {
	this.describe('1.- Pony Express basic')(function() {
		this.specify('Basic Classes')(function(spec) {
		 	spec.assert( !!PonyExpress ).toBe( true );
            spec.assert( !!PonyExpress.Plug ).toBe( true );

		 	spec.completed();
		});

		this.specify('Basic Proyect')(function(spec) {
			spec.assert( !!window.ponyExpress ).toBe( true );
			spec.assert( !!window.messagePlug ).toBe( true );

		 	spec.completed();
		});
	});

	this.describe('2.- Pony Express Basic Bindings')(function() {
		this.specify('Create binding')(function(spec){
			window.messagePlug.bind('create',function(data){
				spec.assert( data.status ).toBe( "created" );

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

		this.specify('Update binding')(function(spec){
			window.messagePlug.bind('update',function(data){
				spec.assert( data.status ).toBe( "updated" );

				spec.completed();
			});

			$.post('/mirror',{
				type   : 'message',
				action : 'update',
				data   : {
					status : 'updated'
				}
			});
		});	


		this.specify('Delete binding')(function(spec){
			window.messagePlug.bind('delete',function(data){
				spec.assert( data.status ).toBe( "deleted" );

				spec.completed();
			});

			$.post('/mirror',{
				type   : 'message',
				action : 'delete',
				data   : {
					status : 'deleted'
				}
			});
		});			
	});

	this.describe('3.- Pony Express Additional Bindings')(function() {
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