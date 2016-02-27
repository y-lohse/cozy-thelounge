var fs = require('fs');
var mkdirp = require('mkdirp');
var TheLounge = require('./lounge');

var loungeDir = 'node_modules/thelounge/',
	configDir = process.env.APPLICATION_PERSISTENT_DIRECTORY || __dirname + '/config',
	configFile = configDir + '/config.js';

var lounge = new TheLounge(loungeDir, configDir);

//make sure there is a full config
fs.stat(configFile, function(err, stats){
	if (err){
		console.log('No existing config found, creating one');
		mkdirp.sync(configDir);
		mkdirp.sync(configDir + '/users');
		fs.writeFileSync(
			configFile,
			fs.readFileSync(__dirname + '/defaults/config.js')
		);
	}
	else{
		//there already is a config
	}
});