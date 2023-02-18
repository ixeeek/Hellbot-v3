const { PermissionFlagsBits } = require('discord.js');
const { sendLogs, newCasenumber, noPingReply } = require('../../utils');
var { casenumber } = require('../../data/data.json');
module.exports = {
	name: 'ban',
	usage: 'ban <@użytkownik/id> [powód]',
	permission: PermissionFlagsBits.BanMembers,
	async execute(message, args) {
		//vars
		const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		let reason = args.slice(1).join(' ') || 'nie podano';
		
		//logging
		const log4js = require('log4js');
		const commandLogger = log4js.getLogger('commands');
		const userLogger = log4js.getLogger('users');
		const consoleLog = log4js.getLogger('console');

		//code
		if(!message.member.permissions.has(module.exports.permission)) {
			const wait = require('node:timers/promises').setTimeout;
			noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`BanMembers\``});
			await wait(10);
			return commandLogger.warn(`${module.exports.name.toUpperCase()} | ${message.member.user.tag} was denied to use command (noPermission)`)
		};
		if(!target)	return noPingReply({message: message, content: `Podaj prawidłowego użytkownika!`});
		if(target.id === message.member.id) return noPingReply({message: message, content: `Nie możesz zbanować samego siebie!`});
		if(target.roles.highest.position >= message.member.roles.highest.position) return noPingReply({message: message, content: `Nie możesz zbanować tego użytkownika!`});
		if(!target.bannable) return noPingReply({message: message, content: `Bot nie może zbanować tego użytkownika!`});

		const rsn = `${reason} | Moderator: ${message.member.user.tag}`;
		target.ban({reason:rsn}).catch(err => {
			if(err) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``});
		}).then(() => {
			sendLogs({
				type: 'ban',
				message: message,
				target: target,
				reason: reason,
				casenumber: casenumber
			});
			noPingReply({message: message, content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie zbanowano **${target.user.tag}**`});
			newCasenumber();

			userLogger.info(`BAN: ${target.user.tag} - ${target.user.id} | reason: ${reason} | moderator: ${message.member.user.tag}`);
			consoleLog.info(`BAN: ${target.user.tag} - ${target.user.id} | reason: ${reason} | moderator: ${message.member.user.tag}`);
			message.guild.channels.cache.get(cnl.membercountchannel).edit({
				name: `👥︱Użytkownicy: ${message.guild.memberCount}`
			});
		});
	}
}