module.exports = function(grunt){
	grunt.initConfig({
		sass: {
			dist: {
				options: {
					'no-source-map': true,
					style: 'compressed',
				},
				files: [{
					expand: true,
					cwd: './components/style/',
					src: ['scss/**/*.scss'],
					dest: 'build/components',
					ext: '.css',
					rename: function(dest, src){
						console.log(dest + '/style/css' + src.slice(4));
						return dest + '/style/css' + src.slice(4);
					},
				}],
			},
		},
		uglify: {
			my_target: {
				files: [{
					expand: true,
					cwd: './components/script/',
					src: ['**/*.js'],
					dest: 'build/components',
					ext: '.js',
					rename: function(dest, src){
						console.log(dest + '/script/' + src);
						return dest + '/script/' + src;
					},
				}],
			},
		},
		pug: {
			compile: {
				options: {
					data: {
						debug: false,
					},
				},
				files: {
					'build/index.html': 'index.pug',
				},
			},
		},
		copy: {
			main: {
				files: [
					{expand: true, src: ['background.js'], dest: 'build/', filter: 'isFile'},
					{expand: true, src: ['LICENSE'], dest: 'build/', filter: 'isFile'},
					{expand: true, src: ['manifest.json'], dest: 'build/', filter: 'isFile'},
					{expand: true, src: ['README.md'], dest: 'build/', filter: 'isFile'},
					{expand: true, src: ['fonts/**'], dest: 'build/'},
					{expand: true, src: ['icons/**'], dest: 'build/'},
				],
			},
		},
		crx: {
			myPublicExtension: {
				src: './build/**/*',
				dest: '../Listen-X.zip',
			},

			mySignedExtension: {
				src: './build/**/*',
				dest: '../Listen-X.crx',
				options: {
					privateKey: '~/dev/Listen-X.pem',
				},
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-pug');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-crx');

	grunt.registerTask('default', ['copy', 'sass', 'uglify', 'pug', 'crx']);
};