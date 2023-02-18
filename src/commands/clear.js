const  { PermissionFlagsBits } = require('discord.js');
const { noPingReply } = require('../../utils');
module.exports = {
	name: 'clear',
	usage: 'clear <ilość>',
	permission: PermissionFlagsBits.ManageMessages,
	async execute(message, args) {
		//vars
		const amount = parseInt(args[0]);

		//logging
		const log4js = require('log4js');
		const commandLogger = log4js.getLogger('commands');

		//code
		if(!message.member.permissions.has(module.exports.permission)) {
			const wait = require('node:timers/promises').setTimeout;
			noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`ManageMessages\``});
			await wait(10);
			return commandLogger.warn(`${module.exports.name.toUpperCase()} | ${message.member.user.tag} was denied to use command (noPermission)`)
		}; 
		
		if(!amount) return noPingReply({message: message, content: `Podaj liczbe wiadomości!`});
		if(isNaN(amount)) return noPingReply({message: message, content: `Podaj prawidłową liczbe!`})
		if(amount > 100 || amount < 1) return noPingReply({message: message, content: `Wartość musi być w zakresie 1-100!`});

		if(amount === 100) {
			message.channel.bulkDelete(amount, true).then(n => {
				message.channel.send(`:white_check_mark: Pomyślnie usunięto \`${n.size}\` wiadomości!`).then(msg => {
					setTimeout(() => {
						msg.delete().catch(() => {return})
					}, 10000)
				})
				console.log(`Usunieto ${n.size} wiadomosci z ${message.channel.name}`);
			});
			return
		} else {
			message.channel.bulkDelete(amount+1, true).then(n => {
				message.channel.send(`:white_check_mark: Pomyślnie usunięto \`${n.size-1}\` wiadomości!`).then(msg => {
					setTimeout(() => {
						msg.delete().catch(() => {return})
					}, 10000)
				})
				console.log(`Usunieto ${n.size} wiadomosci z ${message.channel.name}`);                
			});
			return
		}
	}
}