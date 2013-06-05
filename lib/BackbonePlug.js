Class(PonyExpress,'BackbonePlug').inherits(PonyExpress.Plug)({
	prototype : {
		namespace : "",// Model Name
		events : [],
		init : function (config) {
			config.name = config.name || config.collection.name;

			if(config.channel){
				ponyExpress._io.emit('channel', config.channel);
			}

			PonyExpress.Plug.prototype.init.call(this, config);
		},
		onCreate : function(data){
			if(!data.id){
				throw "PonyExpress Items need id";
			}

			this.collection.add(data);

			this.dispatch('create', data);
		},
		onDelete : function(data){
			if(!data.id){
				throw "PonyExpress Items need id";
			}

			var item = this.collection.find(function(item){
				return item.get('id') === data.id;
			});

			// Item could have been removed before
			if(!item){
				return;
			}

			// Destroy model with out notifiing the server
			// http://stackoverflow.com/questions/10218578/backbone-js-how-to-disable-sync-for-delete
			item.trigger('destroy', item, item.collection);

			this.dispatch('update', data);

		},
		onUpdate : function(data){
			if(!data.id){
				throw "PonyExpress Items need id";
			}

			var item = this.collection.find(function(item){
				return item.get('id') === data.id;
			});

			// Item could have been removed before
			if(!item){
				return;
			}

			item.set(data);

			this.dispatch('update', data);
		}
	}
});