const { PermissionFlagsBits } = require('discord.js');
const warnDatabase = require('../../data/warns.json');
const data = require('../../data/data.json');
const { newCasenumber, noPingReply, sendLogs } = require('../../utils');
const fs = require('node:fs');
module.exports = {
  name: 'warn',
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
		if(target.id === message.member.id) return noPingReply({message: message, content: `Nie możesz zwarnować samego siebie!`});
		if(target.roles.highest.position >= message.member.roles.highest.position) return noPingReply({message: message, content: `Nie możesz zwarnować tego użytkownika!`});
		if(!target.kickable && !target.manageable && !target.moderatable) return noPingReply({message: message, content: `Bot nie może zwarnować tego użytkownika!`});

    try {
      warnDatabase[target.user.id][data.warnId] = {
        reason: reason,
        moderator: message.member.user.tag,
        date: Date.now(),
        casenumber: data.casenumber
      };            
    } catch {
      warnDatabase[target.user.id] = {};
      warnDatabase[target.user.id][data.warnId] = {
        reason: reason,
        moderator: message.member.user.tag,
        date: Date.now(),
        casenumber: data.casenumber
      };    
    };
    fs.writeFile('./data/warns.json', JSON.stringify(warnDatabase, null, 2), function writeJSON(err) {
      if(err) console.error(err);
    });

    noPingReply({message: message, content: `:white_check_mark: \`Case: #${data.casenumber}\` Pomyślnie zwarnowano **${target.user.tag}** (ID: **${data.warnId}**)`});
    target.send(`:warning: \`Ostrzeżenie!\`\n**Powód:** ${reason}\n**Moderator:** ${message.member.user.tag}\n**ID Warna:** ${data.warnId}`).catch(err => {
      if(err) console.log('Warn message wasnt send!');
    });

    sendLogs({
      type: 'warn',
      message: message,
      target: target,
      reason: reason,
      id: data.warnId,
      casenumber: data.casenumber
    });

    newCasenumber();
    data.warnId = data.warnId+1;
    fs.writeFile(`./data/data.json`, JSON.stringify(data, null, 2), function writeJSON(err) {
      if(err) console.error(err);
    });

    userLogger.info(`WARN: ${target.user.tag} - ${target.user.id} | reason: ${reason} | warnId: ${data.warnId} | moderator: ${message.member.user.tag}`);
    consoleLog.info(`WARN: ${target.user.tag} - ${target.user.id} | reason: ${reason} | warnId: ${data.warnId} | moderator: ${message.member.user.tag}`);
  }
}