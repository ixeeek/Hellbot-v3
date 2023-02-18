const fs = require('fs');
const { config } = require('../../data/data.json');
const { PermissionFlagsBits } = require('discord.js');
const { noPingReply } = require('../../utils');
module.exports = {
	name: 'prefix',
	permission: PermissionFlagsBits.ManageGuild,
	execute(message, args) {
		//vars
		const newPrefix = args[0];
		const olfPrefix = config.prefix;

		//logging
		const log4js = require('log4js');
		const commandLogger = log4js.getLogger('commands');
		//commandLogger.info(`${command.name.toUpperCase()} :: ${message.member.user.tag}`)
		
		//code
		if(!message.member.permissions.has(module.exports.permission)) return noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`ManageGuild\``});
		if(!args[0]) return noPingReply({message: message, content: `Podaj nowy prefix!`});

		config.prefix = newPrefix;
		fs.writeFile('./data/data.json', JSON.stringify(px, null, 2), function writeJSON(err) {
			if (err) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``})
		});

		noPingReply({message: message, content: `:white_check_mark: Zmieniono prefix z **${olfPrefix}** na **${newPrefix}**`})
	}
}