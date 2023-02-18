const { PermissionFlagsBits } = require('discord.js');
const { sendLogs, newCasenumber, noPingReply } = require('../../utils');
module.exports = {
	name: 'kick',
	usage: 'kick <@uzytkownik/id> [powod]',
	permission: PermissionFlagsBits.KickMembers,
	async execute(message, args) {
		//vars
		const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		var reason = args.slice(1).join(' ') || 'nie podano';

		//logging
		const log4js = require('log4js');
		const commandLogger = log4js.getLogger('commands');
		const userLogger = log4js.getLogger('users');
		const consoleLog = log4js.getLogger('console');
		
		//code
		if(!message.member.permissions.has(module.exports.permission)) {
			const wait = require('node:timers/promises').setTimeout;
			noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`KickMembers\``});
			await wait(10);
			return commandLogger.warn(`${module.exports.name.toUpperCase()} | ${message.member.user.tag} was denied to use command (noPermission)`)
		}; 
		if(!target) return noPingReply({message: message, content: `Podaj prawidłowego użytkownika!`});
		if(target.id === message.member.id) return noPingReply({message: message, content: `Nie możesz wyrzucić samego siebie!`});
		if(target.roles.highest.position >= message.member.roles.highest.position) return noPingReply({message: message, content: `Nie możesz wyrzucić tego użytkownika!`});
		if(!target.kickable) return noPingReply({message: message, content: `Bot nie może wyrzucić tego użytkownika!`});

		rsn = `${reason} | Moderator: ${message.member.user.tag}`;
		target.kick(rsn).catch(err => {
			if(err) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``});
		}).then(() => {
			var { casenumber } = require('../../data/data.json');
			sendLogs({
				type: 'kick',
				message: message,
				target: target,
				reason: reason,
				casenumber: casenumber
			});

			noPingReply({message: message, content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie wyrzucono **${target.user.tag}**`});
			newCasenumber();

			userLogger.info(`KICK: ${target.user.tag} - ${target.user.id} | reason: ${reason} | moderator: ${message.member.user.tag}`);
			consoleLog.info(`KICK: ${target.user.tag} - ${target.user.id} | reason: ${reason} | moderator: ${message.member.user.tag}`);
			
			message.guild.channels.cache.get(cnl.membercountchannel).edit({
				name: `👥︱Użytkownicy: ${message.guild.memberCount}`
			});
		});
	}
}