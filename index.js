const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: "everyone", partials: ['MESSAGE'] });
const prefix = "hs!";
const token = require("./token.json");
const stations = require("./stations.json"); // List of Stations
const commands = require("./commands.json")
const urlScheme = "https://radio.streemlion.com/";

client.on('ready', () => {
    console.log("Ready")
    client.user.setPresence({
        activity: {
            name: "OnlyHit STATION",
            type: "LISTENING"
        },
        status: "online"
    });
});

client.on('message', async message => {
    if (message.partial) await message.fetch(); // Deal with partials
    if (message.channel.type == "dm") return; // Don't bother with DMs, although it would be cool if bots could call you...
    if (message.author.bot) return;
    let args = message.content.substring(prefix.length).split(" ");
    let command = commands[args[0].toLowerCase()]; // TODO: get rid of this if i dont use it again
    if (command === undefined) return;
    switch (args[0].toLowerCase()) {
        case "station":
            if (!message.member.voice.channel) {
                message.reply("You need to be in a voice channel to do that!");
                break;
            }
            let station = stations[args[1].toLowerCase()];
            if (station === undefined) return;
            message.reply("Switching station to " + station["name"]);
            let connection = await message.member.voice.channel.join();
            let dispatch = connection.play(urlScheme + station["url"]);
            break;

        case "stop":
            if (message.guild.voice.channel == undefined) message.reply("I'm not in a channel!");
            else message.guild.voice.channel.leave();
            break;
        
        case "info":
            message.reply("OnlyHit can be found here: https://onlyhit.us/. I am developed by Zen#0004 and my repository exists at https://github.com/ZenIsBestWolf/hitsmash.");
            break;

        default:
            break;
    }
});

client.login(token.token);