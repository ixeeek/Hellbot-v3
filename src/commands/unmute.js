const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const { roles } = require('../../data/data.json');
const { sendLogs, newCasenumber, noPingReply } = require('../../utils');
module.exports = {
	name: 'unmute',
	usage: 'unmute <@użytkownik>',
	permission: PermissionFlagsBits.MuteMembers,
	async execute(message, args) {
		//vars
		const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let role = message.guild.roles.cache.find(r => r.id == roles.muted);
 
		//logging
		const log4js = require('log4js');
		const commandLogger = log4js.getLogger('commands');
		const userLogger = log4js.getLogger('users');
		const consoleLog = log4js.getLogger('console');

		//code
		if(!message.member.permissions.has(module.exports.permission)) {
			const wait = require('node:timers/promises').setTimeout;
			noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`MuteMembers\``});
			await wait(10);
			return commandLogger.warn(`${module.exports.name.toUpperCase()} | ${message.member.user.tag} was denied to use command (noPermission)`)
		}; 
		if(!target) return noPingReply({message: message, content: `Podaj prawidłowego użytkownika!`});
		if(target.id === message.member.id) return noPingReply({message: message, content: `Nie możesz odmutować samego siebie!`});
		if(target.roles.highest.position >= message.member.roles.highest.position) return noPingReply({message: message, content: `Nie możesz odmutować tego użytkownika!`});
		if(!target.roles.cache.has(role.id)) return noPingReply({message: message, content: `Ten użytkownik nie jest zmutowany!`});

		rsn = `Moderator: ${message.member.user.tag}`;
		target.roles.remove(role.id, rsn).catch(err => {
			if(err) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``});
		}).then(() => {
			const muteDatabase = require('../../data/mutes.json');

			const { casenumber } = require('../../data/data.json');
			sendLogs({
				type: 'unmute',
				message: message,
				target: target,
				muteDatabase: muteDatabase,
				casenumber: casenumber
			});
			
			delete muteDatabase[target.id];
			fs.writeFile('./data/mutes.json', JSON.stringify(muteDatabase, null, 2), function writeJSON(err) {
				if(err) console.log(err);
			});

			noPingReply({message: message, content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie odmutowano **${target.user.tag}**`});
			newCasenumber();

			userLogger.info(`UNMUTE: ${target.user.tag} - ${target.user.id} | moderator: ${message.member.user.tag}`);
			consoleLog.info(`UNMUTE: ${target.user.tag} - ${target.user.id} | moderator: ${message.member.user.tag}`);
		});
	}
}