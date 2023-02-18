const { RepeatMode } = require("discord-music-player");
const { noPingReply } = require("../../../utils");
const { roles } = require('../../../data/data.json');
const { PermissionFlagsBits } = require('discord.js');
module.exports = {
	name: 'jump',
	usage: 'jump <pozycja>',
	async execute(message, args, client) {
		const queue = client.player.getQueue(message.guild.id);
		const djRole = message.guild.roles.cache.find(r => r.id == roles.dj);
		const banRole = message.guild.roles.cache.find(r => r.id == roles.musicbotban);
		const jumpNumber = parseInt(args[0]);

		if(!queue) return noPingReply({message: message, content: `Bot muzyczny nie jest w użyciu!`});
		if(message.member.roles.cache.has(banRole.id)) return noPingReply({message: message, content: `Nie za bardzo możesz to zrobić mordo...`});
		if(!message.member.roles.cache.has(djRole.id) && !message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return noPingReply({message: message, content: `Potrzebujesz roli \`${djRole.name}\` albo permisji \`MANAGE_MESSAEGS\`, żeby użyć tej komendy!`});
		if(!message.member.voice.channel) return noPingReply({message: message, content: `Musisz być na kanale głosowym, żeby użyć tej komendy!`});
		if(message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return noPingReply({message: message, content: `Musisz być na kanale \`${message.guild.me.voice.channel.name}\`, żeby użyć tej komendy!`});
		if(!jumpNumber) return noPingReply({message: message, content: `Podaj piosenke z kolejki do której chcesz przeskoczyć!`});
		if(jumpNumber >  queue.songs.length-1) return message.react('❌');

		if(queue.repeatMode == 0 || queue.repeatMode == 1) queue.setRepeatMode(RepeatMode.DISABLED);
		await queue.skip(jumpNumber-1);
		message.react('↩');
	}
}