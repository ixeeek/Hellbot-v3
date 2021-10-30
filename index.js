/**
 * HellBot is discord.gg/hellup Discord Bot!
 * Bot is using DiscordAPI in discord.js library.
 *  
 * All node modules required for bot: discord.js; fs; cron; moment; ms; quick.db; randomstring; ytdl-core; discord-buttons
 * Required Node version: 16.6
 * 
 */

//modules
const Discord = require('discord.js');
const fs = require('fs');

//DiscordAPI Client
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

//bot config importing
const config = require('./data/config.json');
const token = require('./data/token.json');

//DiscordAPI bot login
client.login(token.token);

//code
/**
 * events handling
 */
const eventfiles = fs.readdirSync('./src/events').filter(f => f.endsWith('.js'));
for(const file of eventfiles) {
    const event = require(`./src/events/${file}`);
    //event load message
    console.log(`Loaded: event.${file};`);

	if(event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
};

/**
 * commands handling
 */
const commandfiles = fs.readdirSync('./src/commands').filter(f => f.endsWith('.js'));
client.commands = new Discord.Collection();
for(const file of commandfiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.name, command);
    //command load message
    console.log(`Loaded: command.${file};`);
};
//end :D