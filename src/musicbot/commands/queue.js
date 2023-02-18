const { EmbedBuilder } = require('discord.js');
const { noPingReply } = require('../../../utils');
module.exports = {
	name: 'queue',
	aliases: ['q'],
	execute(message, args, client) {
		const queue = client.player.getQueue(message.guild.id);
    const currentTrack = queue.nowPlaying;
		const tracks = queue.songs.slice(1, 21).map((m, i) => {
			return `\`${i + 1}\` [${m.name}](${m.url}) [\`${m.duration}\`]`
		});

		if(!currentTrack && tracks.length === 0) return;
		if(!queue) return noPingReply({message: message, content: `Bot muzyczny nie jest w użyciu!`});
		
		if(queue.repeatMode === 0) {
			loopMode = '❌'
		} else if(queue.repeatMode === 1) {
			loopMode = 'piosenka'
		} else if(queue.repeatMode === 2) {
			loopMode = 'kolejka'
		};

		if(tracks.length === '0' || tracks.length === 0) {
			const embed = new EmbedBuilder()
				.setTitle('Kolejka piosenek')
				.setDescription(`**Aktualna piosenka:** [${currentTrack.name}](${currentTrack.url}) [\`${currentTrack.duration}\`]`)
				.setColor(message.guild.members.me.displayHexColor)
				.setFooter({text: `Głośność: ${queue.volume}% | Loop: ${loopMode}`})

			message.channel.send({embeds:[embed]})   
		} else {
			const embed = new EmbedBuilder()
				.setTitle('Kolejka piosenek')
				.setDescription(
					`**Aktualna piosenka** [${currentTrack.name}](${currentTrack.url}) [\`${currentTrack.duration}\`]\n\n**Kolejka:**\n${tracks.join('\n')}${
						queue.songs.length-1 > tracks.length
						? `\n...${
							queue.songs.length - tracks.length === 1
								? `${queue.songs.length - tracks.length - 1} więcej`
								: `${queue.songs.length - tracks.length - 1} więcej`
							}`
						: ''
					}`
				)
				.setColor(message.guild.members.me.displayHexColor)
				.setFooter({text: `Głośność: ${queue.volume}% | Loop: ${loopMode}`})

			message.channel.send({embeds:[embed]})            
		} 
	}
}