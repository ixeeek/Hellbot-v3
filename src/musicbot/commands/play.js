const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { noPingReply } = require('../../../utils');
const { roles } = require('../../../data/data.json');
 module.exports = {
	name: 'play',
	aliases: ['p'],
	usage: 'play <link do piosenki/playlisty>',
	async execute(message, args, client) {
		const queue = client.player.createQueue(message.guild.id, {
			data: {
				channelId: message.channel.id,
				guildId: message.guild.id
			}
		});
		const songLink = args.slice(0).join(' ');

		const banRole = message.guild.roles.cache.find(r => r.id == roles.musicbotban);

		if(!songLink) return noPingReply({message: message, content: `Podaj link do piosenki/playlisty!`});
		if(!message.member.voice.channel) return noPingReply({message: message, content: `Musisz być na kanale głosowym, żeby użyć tej komendy!`});
		if(message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return noPingReply({message: message, content: `Musisz być na kanale \`${message.guild.me.voice.channel.name}\`, żeby użyć tej komendy!`});
		if(message.member.roles.cache.has(banRole.id)) return noPingReply({message: message, content: `Nie za bardzo możesz to zrobić mordo...`});
		await queue.join(message.member.voice.channel);

		if(songLink.includes('playlist') || songLink.includes('list') || songLink.includes('album')) {
			let playlist = await queue.playlist(songLink).catch(err => {
				if(err) return message.react('❌');
			});

			if(!playlist) return message.react('❌');
			const embed = new EmbedBuilder()
				.setDescription(`:musical_note: Dodano do kolejki [${playlist.name}](${playlist.url}) (\`${playlist.songs.length}\` utworów)`)
				.setColor(message.guild.members.me.displayHexColor)

			message.channel.send({embeds:[embed]})
		} else {
			let song = await queue.play(songLink).catch(err => {
				if(err) return message.react('❌');
			});

			const embed = new EmbedBuilder()
				.setDescription(`:musical_note: Dodano do kolejki [${song.name}](${song.url}) (\`${song.duration}\`)`)
				.setColor(message.guild.members.me.displayHexColor)

			message.channel.send({embeds:[embed]})
		}
	}
}