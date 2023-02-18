const { PermissionFlagsBits } = require('discord.js');
const { sendLogs, newCasenumber, noPingReply } = require('../../utils');
module.exports = {
	name: 'unban',
	usage: 'unban <id>',
	permission: PermissionFlagsBits.BanMembers,
	async execute(message, args, client) {
		//vars
		let target;

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
		if(!message.guild.me.permissions.has(module.exports.permission)) return noPingReply({message: message, content: `Bot nie może odbanować tej osoby!`});
		if(target === message.member.id) return noPingReply({message: message, content: `Jak chcesz się odbanować jak nawet nie masz bana?`});

		try {
			target = await client.users.fetch(args[0]);
		} catch(error) {
			if(!target) return noPingReply({message: message, content: `Podaj prawidłowego użytkownika!`});
		};

		try {
			await message.guild.bans.fetch(args[0]);
		} catch(error) {
			console.log(error)
			return noPingReply({message: message, content: `Ta osoba nie jest zbanowana!`});
		};

		rsn = `Moderator: ${message.member.user.tag}`;
		message.guild.members.unban(target, rsn).catch(err => {
			if(err) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``})
		}).then(() => {
			const { casenumber } = require('../../data/data.json');
			sendLogs({
				type: 'unban',
				message: message,
				target: target,
				casenumber: casenumber
			});
			newCasenumber();
			noPingReply({message: message, content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie odbanowano **${target.tag}**`});
			 
			userLogger.info(`UNBAN: ${target.tag} - ${target.id} | moderator: ${message.member.user.tag}`);
			consoleLog.info(`UNBAN: ${target.tag} - ${target.id} | moderator: ${message.member.user.tag}`);
		});
	}
}