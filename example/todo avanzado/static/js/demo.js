window.ponyExpress = new PonyExpress({
	io : "http://localhost:3000"
});



window.ToDoTaskModel = Backbone.Model.extend({
	urlRoot : "/ToDoTask"
});

window.ToDoTaskCollection =  Backbone.Collection.extend({
	name  : "ToDoList",
	model : window.ToDoTaskModel
});



window.ToDoCommentModel = Backbone.Model.extend({
	urlRoot : "/ToDoComment"
});
window.CommentCollection =  Backbone.Collection.extend({
	name  : "ToDoComment",
	model : window.ToDoCommentModel
});



window.ToDoListCollection = new ToDoTaskCollection();

window.ToDoCommentCollection = new CommentCollection();

window.ponyExpress.bind('connect', function(){

	var xhrToDoComment = $.get('/ToDoComment');
	xhrToDoComment.done(function(data){
		window.ToDoCommentCollection.add(data);
		window.ToDoCommentPlug  = new PonyExpress.BackbonePlug({
			collection : window.ToDoCommentCollection
		});			
	});

	var xhrToDoTasks = $.get('/ToDoTask');
	xhrToDoTasks.done(function(data){
		window.ToDoListCollection.add(data);
		window.ToDoListPlug  = new PonyExpress.BackbonePlug({
			collection : window.ToDoListCollection
		});			
	});

});

$(document).ready(function(){

	window.ToDoView = Backbone.View.extend({
		tpl: _.template( $('#AddTask').html() ),
		events : {
			"click #submit" : "send"
		},

		initialize : function(config){
			var todoView = this;

			this.$el = this.targetElement || this.$el;
			this.el = this.$el[0];

			this.render();
			this.$el.appendTo('#Tasks');

			window.ToDoListCollection.on('add', function(ToDoListModel){
				var ToDoListView = new ToDoTaskView({
					model: ToDoListModel,
					id: "task-" + ToDoListModel.id,
				});
				if(ToDoListModel.get('TaskStatus')){
					ToDoListView.$el.appendTo( todoView.$el.find('.TaskComplete') );
				}else{
					ToDoListView.$el.appendTo( todoView.$el.find('.TaskIncomplete') );
				}
			});


		},

		send : function(){
			var user = this.$el.find('#user').val(),
				text = this.$el.find('#text').val();

			if( !user || !text ){
				return;
			}

			var model = new ToDoTaskModel({user: user, text: text});

			model.save();

			this.$el.find('#text').val("");

		},

		render : function(){
			this.$el.html( this.tpl({}) );
		}
	});

	window.ToDoTaskView = Backbone.View.extend({
		tpl: _.template( $('#ToDoList-template').html() ),
		events : {
			"click .highlight" : "highlightHandler",
			"click .remove"    : "removeHandler",
			"click .Task"      : "ShowAnswer",
			"click .submit"    : "Comment",
			"keyup .text"      : "Enter"
		},	

		initialize : function(config){
			var ToDoListView = this;

			
			this.render();

			this.model.on('change', function(){
				ToDoListView.render();
			});


			this.model.on('destroy', this.destroyHandler);

			this.ComentCollection


			this.destroyHandler = function(){
				console.log('destroying', this.toJSON() );
				ToDoListView.remove();
			}

			return this;
		},

		highlightHandler : function(){

			if(this.model.get('TaskStatus')){
				this.model.set('TaskStatus', false);
			}else{
				this.model.set('TaskStatus', true);
			}
			this.model.save();

			this.render();
		},

		removeHandler : function(){
			this.model.off('destroy', this.destroyHandler);
			this.model.destroy();
			this.remove();
		},

		ShowAnswer : function () {
			if (this.$el.find('.answer').css('height') == '0px'){
				this.$el.find('.Task').css('border-bottom',"1px solid #D1D2D3");
				this.$el.find('.answer').css('height','2.5em');
				this.$el.find('.answer').css('padding','1em 0');
				this.$el.find('.answer').css('border-top','1px solid #D1D2D3');
				this.$el.find('.answer-comments').css('height','200px');
				this.$el.find('.answer-comments').css('overflow','auto');

				i = 1;

			}else{
				this.$el.find('.answer').css('border-top','0px');
				this.$el.find('.answer').css('height','0px');
				this.$el.find('.answer').css('padding','0px');
				this.$el.find('.answer-comments').css('height','0px');
				i = 0;
			}
		},

		Comment : function () {
			var user = this.$el.find('.user').val(),
				text = this.$el.find('.text').val();

			if( !user || !text ){
				return;
			}

			var model = new ToDoCommentModel({
				Task:    this.$el[0].id,
				user:    user, 
				text: text
			});

			model.save();


			this.$el.find('div.answer-comments').append("<div class='comments'><h3>"+user+"</h3><p>"+text+"</p>");

			this.$el.find('.text').val("");

		},

		Enter: function (data) {
			if (data.keyCode == 13){
				this.$el.find('.submit').click();
			}
		},

		render : function(){
			this.$el.html( this.tpl( this.model.toJSON() ) );

			if(this.model.get('TaskStatus')){
				this.$el.addClass('highlighted');
				this.$el.appendTo(".TaskComplete");
			}else{
				this.$el.removeClass('highlighted');
				this.$el.appendTo(".TaskIncomplete");
			}

			div_id = this.$el;

			ToDoCommentCollection.forEach(function( data ){
				if ( data.attributes.Task == div_id[0].id ){
					div_id.find('div.answer-comments').append("<div class='comments'><h3>"+data.attributes.user+"</h3><p>"+data.attributes.text+"</p>");
				}
			});
		}
	});

	var i = 0;

	window.tareas = new window.ToDoView({
		targetElement : $('#Tasks')
	});

	$('#text').keyup(function(data){
		if (data.keyCode == 13){
			$('#submit').click();
		}
	});

	$('#all').on('click',function(){
		$('.TaskComplete').show();
		$('.TaskIncomplete').show();
	});

	$('#complete').on('click',function(){
		$('.TaskComplete').show();
		$('.TaskIncomplete').hide();
	});

	$('#incomplete').on('click',function(){
		$('.TaskIncomplete').show();
		$('.TaskComplete').hide();
	});

	$('.write').on('click',function(){
		$('.TaskIncomplete').find('.highlight').click();
	});

});
