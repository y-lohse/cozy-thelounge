'use strict';
var exec = require('child_process').exec;

class Lounge{
	constructor(loungeDir, homeDir){
		this.loungeDir = loungeDir;
		this.home = homeDir;
	}
	cmd(command){
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
	}
	start(){
		var port = process.env.PORT || 9155;
		var host = process.env.HOST || '127.0.0.1';
		var startCommand = 'start --port ' + port + ' --host ' + host;
		
		return this.cmd(startCommand);
	}
}

module.exports = Lounge;