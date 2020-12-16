const Discord = require('discord.js');
const Query = require("minecraft-query");

const bot = new Discord.Client();
const config = require('./config.json');
bot.login(config.token);

var mcIP = config.ip;
var dIP = config.displayip;
var mcPort = config.port;
var serverName = 'KOTH';
var serverLogo = "https://i.imgur.com/szHlGja.png";
var ch;

var q;
var embed;
var status;
var color;
var players;
var time;
var body;
async function check(){
	q = new Query({host: mcIP, port: mcPort, timeout: 7500});
	time = new Date().toLocaleString();
	// ch.bulkDelete(100).then(messages => console.log(`Bulk deleted ${messages.size} messages`)).catch(console.error);
	await q.basicStat().then(s => {
		console.log("online");
		//console.log(s);
		q.close();
		status = "Online";
		color = 65280;
		players = "**" + s.online_players + "** / **" + s.max_players + "**";
		embed = {
			"author": {
				"name": serverName + " Server Status",
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
					"value": players,
					"inline": true
				}
			],
			"footer": {
				"text": "IP: " + dIP + "\nUpdated at: " + time
			}
		};
		msg.edit({ embed });
	}).catch(e => {
		console.log("offline");
		//console.log(e);
		status = "Offline"
		color = 16711680
		players = "**0** / **0**";
		embed = {
			"author": {
				"name": serverName + " Server Status",
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
					"value": players,
					"inline": true
				}
			],
			"footer": {
				"text": "IP: " + dIP + "\nUpdated at: " + time
			}
		};
		msg.edit({ embed });
	});
	console.log(time);
	console.log();
}


bot.on('ready', () => {
	console.log("Bot is active");
	bot.channels.fetch(config.channel).then(channel => {
		console.log(channel.name);
		ch=channel;
		ch.messages.fetch(config.message).then(message => {
			console.log(message.author);
			msg = message;
			check();
		}).catch(console.error);
	}).catch(console.error);
	setInterval(check,30000);
});