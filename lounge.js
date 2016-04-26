'use strict';
var exec = require('child_process').exec;

var Lounge = {
	loungeDir: '',
	home: '',
	init: function(loungeDir, homeDir){
		this.loungeDir = loungeDir;
		this.home = homeDir;
	},
	cmd: function(command){
		var fullCommand = "node " + this.loungeDir + "index.js " + command + " --home " + this.home;
		
		var handler = exec(fullCommand);
		
		handler.stdout.on('data', function(message){
			console.log(message);
		});
		
		handler.stderr.on('data', function(message){
			console.log('lounge error (' + command + '): ' + message);
		});
		
		handler.on('exit', function(code){
			console.log('lounge (' + command + ') exit code ' + code);
		});
		
		return handler;
	},
	start: function(){
		//set the HOME env variable first, but without the /.lounge at the end because it gets appended by the code in TheLounge
		process.env.HOME = this.home.substr(0, this.home.lastIndexOf('/'));
		
		var server = require('./' + this.loungeDir + 'src/server.js');
		
		server({
			host: process.env.HOST || '127.0.0.1',
			port: process.env.PORT || 9624,
			bind: undefined,
			public: false
		});
	},
	add: function(user, password){
		var userHandler = this.cmd('add ' + user);
			
		userHandler.stdout.on('data', function(message){
			//contrary to what the doc says, the password has to be inputed manually
			if (message.match(/Enter\spassword/g)) userHandler.stdin.write(password + "\n");
            
			//and then for whatever reason, the process doesn't terminate after the user is created
			else if (message.match(new RegExp("^User '" + user + "' created"))) userHandler.kill();
		});

		return userHandler;
	}
};

module.exports = Lounge;