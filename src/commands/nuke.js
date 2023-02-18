const { PermissionFlagsBits } = require('discord.js');
const { sendLogs, newCasenumber, noPingReply } = require('../../utils');
module.exports = {
	name: 'nuke',
	permission: PermissionFlagsBits.ManageChannels,
	async execute(message, args) {
		//logging
		const log4js = require('log4js');
		const commandLogger = log4js.getLogger('commands');

		//code
		if(!message.member.permissions.has(module.exports.permission)) {
			const wait = require('node:timers/promises').setTimeout;
			noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`ManageChannels\``});
			await wait(10);
			return commandLogger.warn(`${module.exports.name.toUpperCase()} | ${message.member.user.tag} was denied to use command (noPermission)`)
		}; 

		message.channel.clone({
			reason: `Moderator: ${message.member.user.tag}`
		}).then(channel => {
			channel.setPosition(message.channel.position)
			channel.send(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie wyczyszczono kanał!`)
			message.channel.delete(`Moderator: ${message.member.user.tag}`)
		});

		const { casenumber } = require('../../data/data.json');
		sendLogs({
			type: 'nuke',
			message: message,
			casenumber: casenumber
		});
		newCasenumber();
	}
}