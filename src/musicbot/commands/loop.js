const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { RepeatMode } = require('discord-music-player');
const { roles } = require('../../../data/data.json');
module.exports = {
	name: 'loop',
	aliases: ['l'],
	execute(message, args, client) {
		const queue = client.player.getQueue(message.guild.id);
		const djRole = message.guild.roles.cache.find(r => r.id == roles.dj);
		const banRole = message.guild.roles.cache.find(r => r.id == roles.musicbotban);

		if(!queue) return noPingReply({message: message, content: `Bot muzyczny nie jest w użyciu!`});
		if(message.member.roles.cache.has(banRole.id)) return noPingReply({message: message, content: `Nie za bardzo możesz to zrobić mordo...`});
		if(!message.member.roles.cache.has(djRole.id) && !message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return noPingReply({message: message, content: `Potrzebujesz roli \`${djRole.name}\` albo permisji \`MANAGE_MESSAEGS\`, żeby użyć tej komendy!`});
		if(!message.member.voice.channel) return noPingReply({message: message, content: `Musisz być na kanale głosowym, żeby użyć tej komendy!`});
		if(message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return noPingReply({message: message, content: `Musisz być na kanale \`${message.guild.me.voice.channel.name}\`, żeby użyć tej komendy!`});

		if(queue.repeatMode === 0) {
			const embed = new EmbedBuilder()
				.setDescription(':musical_note: Loop ustawiony na **piosenke**')
				.setColor(message.guild.members.me.displayHexColor)

			queue.setRepeatMode(RepeatMode.SONG);
			message.channel.send({embeds:[embed]});
		} else if(queue.repeatMode === 1) {
			const embed = new EmbedBuilder()
				.setDescription(':musical_note: Loop ustawiony na **kolejkę**')
				.setColor(message.guild.me.displayHexColor)

			queue.setRepeatMode(RepeatMode.QUEUE);
			message.channel.send({embeds:[embed]});
		} else if(queue.repeatMode === 2) {
			const embed = new EmbedBuilder()
				.setDescription(':musical_note: Loop **wyłączony**')
				.setColor(message.guild.members.me.displayHexColor)

			queue.setRepeatMode(RepeatMode.DISABLED);
			message.channel.send({embeds:[embed]});
		}
	}
}