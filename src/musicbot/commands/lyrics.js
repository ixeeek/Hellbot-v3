const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const lyricsFinder = require('lyrics-finder');
const { noPingReply } = require('../../../utils');
module.exports = {
	name: 'lyrics',
	aliases: ['ls', 'lc', 'lyc'],
	usage: 'lyrics <tytuł piosenki>',
	async execute(message, args, client) {
		const queue = client.player.getQueue(message.guild.id);
		var songTitle = args.slice(0).join(' ');
		const currentTrack = queue.nowPlaying;

		if(!queue) return noPingReply({message: message, content: `Bot muzyczny nie jest w użyciu!`});

		const lyricsEmbed = new EmbedBuilder()
			.setTimestamp()
			.setFooter(`Dla: ${message.member.user.tag}`)
			.setColor(message.guild.me.displayHexColor)
		if(!songTitle) {
			let getLyrics = await lyricsFinder(currentTrack.name) || 'notfound';
			lyricsEmbed.setTitle(`Słowa: ${currentTrack.name}`)
			if(getLyrics === 'notfound') {
				lyricsEmbed.setDescription(`:x: Nie znaleziono słów dla tej piosenki :(`)
			} else {
				lyricsEmbed.setDescription(`${getLyrics}`)
			};
			return message.channel.send({embeds: [lyricsEmbed]}).catch(e => {
				if(e) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``});
			});
		} else {
			let getLyrics = await lyricsFinder(songTitle) || 'notfound';
			lyricsEmbed.setTitle(`Słowa: ${songTitle}`)
			if(getLyrics === 'notfound') {
				lyricsEmbed.setDescription(`:x: Nie znaleziono słów dla tej piosenki :(`)
			} else {
				lyricsEmbed.setDescription(`${getLyrics}`)
			};
			return message.channel.send({embeds: [lyricsEmbed]}).catch(e => {
				if(e) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``});
			});
		}
	}
}