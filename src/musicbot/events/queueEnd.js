const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'queueEnd',
	async execute(queue, client) {
		const queueChannel = client.channels.cache.find(c => c.id === queue.data.channelId);
		if(queue.data.songMessageId) queueChannel.messages.fetch(queue.data.songMessageId).then(msg => {
			if(msg) msg.delete()
		}).catch(e => {});
		
		setTimeout(async () => {
			if(queue.songs.length == 0) {
		await queue.guild.members.me.voice.disconnect();
				const queueChannel = client.channels.cache.find(c => c.id === queue.data.channelId);

				const embed = new EmbedBuilder()
					.setDescription(':musical_note: Opuszczono kanał ze względu na brak aktywności')
					.setColor(queue.guild.me.displayHexColor)
				queueChannel.send({embeds: [embed]});
			};
		}, 600000)
	}
}