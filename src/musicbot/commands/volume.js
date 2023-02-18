const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { noPingReply } = require("../../../utils");
const { roles } = require('../../../data/data.json');
module.exports = {
	name: 'volume',
	aliases: ['v'],
	async execute(message, args, client) {
		const queue = client.player.getQueue(message.guild.id);
		const djRole = message.guild.roles.cache.find(r => r.id == roles.dj);
		const banRole = message.guild.roles.cache.find(r => r.id == roles.musicbotban);
		const newVolume = parseInt(args[0]);

		if(!queue) return noPingReply({message: message, content: `Bot muzyczny nie jest w użyciu!`});
		if(message.member.roles.cache.has(banRole.id)) return noPingReply({message: message, content: `Nie za bardzo możesz to zrobić mordo...`});
		if(!message.member.roles.cache.has(djRole.id) && !message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return noPingReply({message: message, content: `Potrzebujesz roli \`${djRole.name}\` albo permisji \`MANAGE_MESSAEGS\`, żeby użyć tej komendy!`});
		if(!message.member.voice.channel) return noPingReply({message: message, content: `Musisz być na kanale głosowym, żeby użyć tej komendy!`});
		if(message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return noPingReply({message: message, content: `Musisz być na kanale \`${message.guild.me.voice.channel.name}\`, żeby użyć tej komendy!`});
		if(isNaN(newVolume)) return noPingReply({message: message, content: `Podaj prawidłową liczbe!`});
		if(newVolume > 400) return message.react('❌');
		
		await queue.setVolume(newVolume)
		const embed = new EmbedBuilder()
			.setDescription(`:musical_note: Ustawiono głośność na: **${newVolume}%**`)
			.setColor(message.guild.members.me.displayHexColor)

		return message.channel.send({embeds:[embed]})
	}
}