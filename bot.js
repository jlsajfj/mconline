const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
bot.login(config.token); //Add your own Discord bot token

const prefix = config.prefix //Bot command prefix
var request = require('request');
var CMD = 'ping'; //Command to trigger
var mcIP = config.ip; //Add your Minecraft server IP
var mcPort = config.port; //The port of the server, default it 25565
var serverName = 'KOTH'; //Your server name
var serverUrl = ""; //Server website
var serverLogo = "https://i.imgur.com/szHlGja.png"; //Server logo
var ch;

function check(){
    var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;
	ch.bulkDelete(100).then(messages => console.log(`Bulk deleted ${messages.size} messages`)).catch(console.error);
    request(url, function (err, response, body) {
      if (err) {
        console.log(err);
        return message.reply('Error getting Minecraft server status...');
      }
      
      body = JSON.parse(body);
      var status = "Offline"
      var color = 16711680
      if (body.online) {
        status = "Online";
        color = 65280
      }
      var players = 0
      if (body.players.now) {
        players += body.players.now;
      }
      else {
        players += 0
      }
      
      const embed = {
        "author": {
          "name": serverName + " Server Status",
          "url": serverUrl,
          "icon_url": serverLogo
        },
        "color": color,
        "fields": [
          {
            "name": "Status:",
            "value": status,
            "inline": true
          },
          {
            "name": "Players Online:",
            "value": "**" + body.players.now + "** / **" + body.players.max + "**",
            "inline": true
          }
        ],
        "footer": {
          "text": "IP: " + mcIP
        }
      };
      ch.send({ embed });
    });
}


bot.on('ready', () => {
	console.log("Bot is active");
	bot.channels.fetch(config.channel).then(channel => {
		console.log(channel.name);
		ch=channel;
		check();
	}).catch(console.error);
	bot.user.setActivity(prefix + CMD);
	setInterval(check,30000);
});