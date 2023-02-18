const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const moment = require('moment');
const { sendLogs, newCasenumber, noPingReply } = require('../../utils');
module.exports = {
	name: 'mute',
	usage: 'mute <@użytkownik> <czas> [powód]',
	permission: PermissionFlagsBits.MuteMembers,
	async execute(message, args) {
		//vars
		const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		var time = args[1];
		var reason = args.slice(2).join(' ') || 'nie podano';
		let { roles } = require('../../data/data.json');
		let role = message.guild.roles.cache.find(r => r.id == roles.muted);
		const muteDatabase = require('../../data/mutes.json'); //mute database

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
		if(!time) return noPingReply({message: message, content: `Podaj prawidłowy czas muta!`});
		if(target.id === message.member.id) return noPingReply({message: message, content: `Nie możesz zmutować samego siebie!`});
		if(target.roles.highest.position >= message.member.roles.highest.position) return noPingReply({message: message, content: `Nie możesz zmutować tego użytkownika!`});
		if(target.roles.cache.has(role.id)) return noPingReply({message: message, content: `Ten użytkownik jest już zmutowany!`});

		//muted until
		var mutedUntil = Date.now() + ms(time);
		var mutedUntilConverted = moment(Date.now() + ms(time)).format('DD/MM/YY HH:mm:ss');

		rsn = `${reason} | Czas: ${time} | Moderator: ${message.member.user.tag} | Zmutowano do: ${mutedUntilConverted}`;
		target.roles.add(role.id, rsn).catch(err => {
			if(err) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``});
		}).then(() => {
			const { casenumber } = require('../../data/data.json');
			sendLogs({
				type: 'mute',
				message: message,
				target: target,
				reason: reason,
				time: time,
				until: mutedUntilConverted,
				casenumber: casenumber
			});

			noPingReply({message: message, content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie zmutowano **${target.user.tag}**`});
			target.send(`\`Zostałeś zmutowany!\`\n**Moderator:** ${message.member.user.tag}\n**Powód:** ${reason}\n**Czas muta:** ${time}\n**Unmute:** ${mutedUntilConverted}`).catch(err => {if(err) console.log('Mute message wasnt send!')});
			newCasenumber();

			userLogger.info(`MUTE: ${target.user.tag} - ${target.user.id} | reason: ${reason} | time: ${time} | moderator: ${message.member.user.tag}`);
			consoleLog.info(`MUTE: ${target.user.tag} - ${target.user.id} | reason: ${reason} | time: ${time} | moderator: ${message.member.user.tag}`);


			//saving mute to database
			muteDatabase[target.user.id] = {
				guild: message.guild.id,
				reason: reason,
				time: mutedUntil,
				moderator: message.member.user.tag,
				casenumber: casenumber
			};
			fs.writeFile('./data/mutes.json', JSON.stringify(muteDatabase, null, 2), function writeJSON(err) {
				if(err) console.log(err);
			});
		});
	}
}