/**
 * 
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
const client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.GuildVoiceStates
	]
});
//bot config importing
require('dotenv').config()
const data = require('./data/data.json');


//code
/**
 * Logs
 */
const log4js = require('log4js');
log4js.configure({
	appenders: { commands: { type: 'file', filename: './logs/commands.log'}, start: { type: 'file', filename: './logs/start.log'}, console: { type:'console'}, users: { type: 'file', filename: './logs/users.log'}, privVoice: { type: 'file', filename: './logs/privVoice.log' }},
	categories: { default: {appenders: ['commands'], level: 'info'}, start: {appenders: ['start'], level: 'info'}, console: {appenders: ['console'], level: 'info'}, users: {appenders: ['users'], level: 'info' }, privVoice: {appenders: ['privVoice'], level: 'info' }}
});
const startLogger = log4js.getLogger('start');
const consoleLog = log4js.getLogger('console');
startLogger.warn('----------------------------------------------------------------------------------');
startLogger.warn('Starting...');

consoleLog.info(`Starting Hellbot v${data.config.version}`);

/**
 * events handling
 */
const eventfiles = fs.readdirSync('./src/events').filter(f => f.endsWith('.js'));
for(const file of eventfiles) {
	const event = require(`./src/events/${file}`);
	startLogger.info(`Loaded: event.${file};`);
	consoleLog.info(`Loaded: event.${file};`);

	if(event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	};
};

/**
 * commands handling
 */
const commandfiles = fs.readdirSync('./src/commands').filter(f => f.endsWith('.js'));
client.commands = new Discord.Collection();
for(const file of commandfiles) {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.name, command);
	startLogger.info(`Loaded: command.${file};`);
	consoleLog.info(`Loaded: command.${file};`);
};


/**
 * music bot
 */
//player settings
const { Player } = require('discord-music-player');
const player = new Player(client, {
  deafenOnJoin: true,
  leaveOnEmpty: true,
  leaveOnEnd: false,
  leaveOnStop: false,
  timeout: 50,
});
client.player = player

//commands
const musicBotFiles = fs.readdirSync('./src/musicbot/commands').filter(mf => mf.endsWith('.js'));
for(const musicBotFile of musicBotFiles) {
  const musicCommand = require(`./src/musicbot/commands/${musicBotFile}`);
  client.commands.set(musicCommand.name, musicCommand);
  startLogger.info(`Loaded: musicbot.command.${musicBotFile};`);
  consoleLog.info(`Loaded: musicbot.command.${musicBotFile};`);
};
//events
const musicBotEventsFiles = fs.readdirSync('./src/musicbot/events').filter(f => f.endsWith('.js'));
for(const musicBotEventFile of musicBotEventsFiles) {
  const event = require(`./src/musicbot/events/${musicBotEventFile}`);
  startLogger.info(`Loaded: musicbot.event.${musicBotEventFile};`);
  consoleLog.info(`Loaded: musicbot.event.${musicBotEventFile};`);
	player.on(event.name, (...args) => event.execute(...args, client));
};

//DiscordAPI bot login
consoleLog.info('Connecting to DiscordAPI...');
client.login(process.env.TOKEN);
consoleLog.info('Connected!');
//end :D