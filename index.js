const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: "everyone", partials: ['MESSAGE'] });
const prefix = "hs!";
const stations = require("./stations.json"); // List of Stations
const commands = require("./commands.json");
const urlScheme = "https://radio.streemlion.com/";

client.on('ready', () => {
    console.log("Ready")
    client.user.setPresence({
        activity: {
            name: "OnlyHit US/Japan/Gold/K-Pop",
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
        case "help":
            let tbsHelp = "Here are the list of commands:\n\n";
            for (let i=0; i < Object.keys(commands).length; i++) {
                let localcmd = commands[Object.keys(commands)[i]]
                if (localcmd["info"] == "alias") continue;
                tbsHelp+="**"+prefix+Object.keys(commands)[i];
                let tempvar = localcmd["args"];
                if (!(tempvar === undefined)) tbsHelp+=" ["+tempvar+"]";
                tbsHelp+="**: " + localcmd["info"] + "\n";
            }
            message.channel.send(tbsHelp);
            break;
        case "play":
        case "station":
            if (!message.member.voice.channel) {
                message.reply("You need to be in a voice channel to do that!");
                break;
            }
            let station = stations[args[1].toLowerCase()];
            if (station === undefined) {
                message.reply("You provided an invalid station. Check the list of valid stations with ``" + prefix + "stations``!");
                return;
            }
            let tripwire = false; // I CANT FUCKING BREAK OR RETURN IN A CATCH STATEMENT WHYYY
            let connection = await message.member.voice.channel.join().catch(() => {
                message.reply("I couldn't find your voice channel!");
                tripwire=true;
            });
            if (tripwire) return;
            message.reply("Tuning to station **" + station["name"] + "**");
            connection.play(urlScheme + station["url"]);
            break;

        case "disconnect":
        case "fuckoff":
        case "stop":
            try {
                message.guild.voice.channel.leave()
            } catch (error) {
                message.reply("I am not in a channel!")
            }
            break;
        
        case "info":
            message.reply("OnlyHit can be found here: https://onlyhit.us/. I am developed by Zen#0004 and my repository exists at https://github.com/ZenIsBestWolf/hitsmash.");
            break;

        case "invite":
            message.reply("You can invite me with this link: https://discord.com/oauth2/authorize?client_id=765937777220255765&scope=bot&permissions=34606080");
            break;
        
        case "stations":
            let tbsStations = "Here is the list of stations:\n\n";
            for (let i=0; i<Object.keys(stations).length; i++) tbsStations+="**"+stations[Object.keys(stations)[i]]["name"] + "**: ``" + Object.keys(stations)[i] + "``\n";
            message.channel.send(tbsStations);
            break;

        default:
            break;
    }
});

client.login(process.env.TOKEN);