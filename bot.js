const Discord = require('discord.js');
const Query = require("minecraft-query");
const FS = require('fs');
const mp = './message.json';

const bot = new Discord.Client();
const config = require('./config.json');
var messageConfig;
bot.login(config.token);

var setup = false;
var messageLoc;
var channelLoc;

var mcIP = config.ip;
var dIP = config.ip;
if(config.hasOwnProperty('displayip'){
    dIP = config.displayip;
}
var mcPort = config.port;
var dPort = config.port;
if(config.hasOwnProperty('displayport'){
    dPort = config.displayport;
}
var serverName = 'KOTH';
var serverLogo = "https://i.imgur.com/szHlGja.png";

var mess;
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
    time = time.slice(0,-6)+time.slice(-3);
    
    await q.basicStat().then(s => {
        console.log("server is online");
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
                "text": "IP: " + dIP + ":" + dPort + "\nUpdated at: " + time
            }
        };
        mess.edit({ embed });
    }).catch(e => {
        console.log("server is offline");
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
                "text": "IP: " + dIP + ":" + dPort + "\nUpdated at: " + time
            }
        };
        mess.edit({ embed });
    });
    console.log(time);
    console.log();
}

var running;

bot.on('message', msg => {
    if(msg.content === '!!load'){
        console.log('\x1b[32mload initiated\x1b[0m');
        if(setup){
            clearInterval(running);
            mess.delete().catch(console.error)
        }
        channelLoc = msg.channel.id;
        
        msg.channel.send('',{
            embed: {
                "title": "Hello!",
                "description": "Bot is currently setting up.\nThis message should disappear soon."
            }
        }).then( mmsg => {
            messageLoc = mmsg.id;
            var temp = {
                message: messageLoc,
                channel: channelLoc
            };
            
            var data = JSON.stringify(temp);
            FS.writeFileSync('message.json', data);
            mess = mmsg;
            check();
            running = setInterval(check,60000);
            setup = true;
        }).catch(console.error);
        msg.delete().catch(console.error);
    }
});

bot.on('ready', () => {
    console.log("Bot is active");
    try{
        if(FS.existsSync(mp)){
            console.log('\x1b[32mbot is starting up\x1b[0m');
            setup = true;
            messageConfig = require(mp);
            messageLoc = messageConfig.message;
            channelLoc = messageConfig.channel;
            bot.channels.fetch(channelLoc).then(channel => {
                console.log(channel.name);
                
                channel.messages.fetch(messageLoc).then(message => {
                    //console.log(message.author);
                    mess = message;
                    check();
                    running = setInterval(check,60000);
                    console.log('\x1b[32mbot is done loading\x1b[0m');
                }).catch(e => {
                    console.log('\x1b[31myour config is invalid\x1b[0m');
                    console.log('\x1b[31mplease delete your message.json file\x1b[0m');
                    process.exit();
                });
            }).catch(console.error);
        } else {
            console.log('\x1b[31mmessage.json does not exist\x1b[0m');
        }
    } catch(e) {
        console.log(e);
        console.log('\x1b[31mplease delete your message.json file\x1b[0m');
    }
});