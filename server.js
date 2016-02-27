var fs = require('fs'),
	mkdirp = require('mkdirp'),
	TheLounge = require('./lounge');
var defaultConfig = require('./defaults/config.js');

var loungeDir = 'node_modules/thelounge/',
	configDir = process.env.APPLICATION_PERSISTENT_DIRECTORY || __dirname + '/config',
	configFile = configDir + '/config.js';

var lounge = new TheLounge(loungeDir, configDir);

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
			var userHandler = lounge.cmd('add '+userName);
			
			userHandler.stdout.on('data', function(message){
				//contrary to what the doc says, the password has to be inputed manually
				if (message.match(/^Password/)) userHandler.stdin.write("\n");
				//and then for whatever reason, the process doesn't terminate after the user is created
				else if (message.match(new RegExp("^User '" + userName + "' created"))) userHandler.kill();
			});
			
			userHandler.on('exit', function(){
				//write default networks
				var userInfo = require(userFile);
				var defaultNetwork = defaultConfig.defaults;
				
				defaultNetwork.nick = defaultNetwork.username = defaultNetwork.realname = userName;
				
				userInfo.networks = [defaultNetwork];

				fs.writeFileSync(
					userFile,
					JSON.stringify(userInfo, null, 2)
				);
				
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