var fs = require('fs'),
	mkdirp = require('mkdirp'),
	lounge = require('./lounge');
var defaultConfig = require('./defaults/config.js');

var loungeDir = 'node_modules/thelounge/',
	configDir = process.env.APPLICATION_PERSISTENT_DIRECTORY || __dirname + '/config',
	configFile = configDir + '/config.js';

lounge.init(loungeDir, configDir);

var userName = defaultConfig.cozyuser;

//make sure there is a full config
function checkConfig(){
	fs.stat(configFile, function(err, stats){
		if (err){
			console.log('No existing config found, creating one');
			mkdirp.sync(configDir);
			fs.writeFileSync(
				configFile,
				fs.readFileSync(__dirname + '/defaults/config.js')
			);
			console.log('created file ' + configFile);
			
			//now create the user
			checkUser();
		}
		else{
			//there already is a config, advance to user check
			checkUser();
		}
	});
}

//cheks if we have created a user, and if not create one
function checkUser(){
	var userFile = configDir + '/users/' + userName + '.json';
	
	fs.stat(userFile, function(err, stats){
		if (err){
			var userHandler = lounge.add(userName, '');//no password
			
			userHandler.on('exit', function(){
				//write default networks
				var userInfo = require(userFile);
				var defaultNetwork = defaultConfig.defaults;
				
				defaultNetwork.nick = defaultNetwork.username = defaultNetwork.realname = userName + '-' + Math.round(Math.random() * 1000);
				
				userInfo.networks = [defaultNetwork];

				fs.writeFileSync(
					userFile,
					JSON.stringify(userInfo, null, 2)
				);
				
				console.log('Created user ' + userName);
				startApp();
			});
		}
		else {
			//there is an existing user, advancing to next step
			startApp();
		}
	});
}

function startApp(){
	lounge.start();
}

//this will kickstart all the rest
checkConfig();