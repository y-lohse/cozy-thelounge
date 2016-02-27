'use strict';
var exec = require('child_process').exec;

class Lounge{
	constructor(loungeDir, homeDir){
		this.loungeDir = loungeDir;
		this.home = homeDir;
	}
	cmd(command){
		var fullCommand = "node " + this.loungeDir + "index.js " + command + " --home " + this.home;
		
		return exec(fullCommand);
	}
	start(){
		var port = process.env.PORT || 9155;
		var host = process.env.HOST || '127.0.0.1';
		var startCommand = 'start --port ' + port + ' --host ' + host;
		
		var start = this.cmd(startCommand);
		
		start.stdout.on('data', function(message){
			console.log(message);
		});
		
		start.stderr.on('data', function(message){
			console.log('lounge error: ' + message);
		});
		
		start.on('exit', function(code){
			console.log('lounge exit code ' + code);
		});
	}
}

module.exports = Lounge;