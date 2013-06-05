module.exports = function(grunt) {
	grunt.initConfig({
		uglify : {
			options : {
				compress:true,
				report:true,
				banner:'/*!<%= grunt.template.date() %> */\n'
			},
			PonyExpress : {
				files: {
					'PonyExpress.min.js' : [
						'lib/PonyExpress.js',
						'lib/Plug.js',
						'lib/BackbonePlug.js'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default',['uglify']);
};