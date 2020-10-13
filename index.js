const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: "everyone", partials: ['MESSAGE', 'REACTION'] });
const prefix = "?";
const token = require("./token.json");;
const srcURL = "https://radio.streemlion.com/onlyhitjapan";

client.on('ready', () => {
    console.log("Ready")
});

client.on('message', async message => {
    if (message.partial) await message.fetch(); // Deal with partials
    if (message.channel.type == "dm") return; // fuck off
    if (message.author.bot) return;
    if (message.content == prefix + "fuck") message.reply("fuck"); // test
    if (message.content == prefix + "getin") {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(srcURL);
        } else {
            message.reply("you\'re not in a channel dipshit.");
        };
    };
});

client.login(token.token);