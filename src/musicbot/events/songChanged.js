const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'songChanged',
	execute(queue, newSong, oldSong, client) {
		const queueChannel = client.channels.cache.find(c => c.id === queue.data.channelId);

		if(queue.data.songMessageId) queueChannel.messages.fetch(queue.data.songMessageId).then(msg => {
			if(msg) msg.delete()
		}).catch(e => {})

		if(!newSong) {
			if(queue.size > 0) {
				try {
					queue.skip()
				} catch(e) {
					if(e) return;
				};
			};
			return
		}

		const embed = new EmbedBuilder()
			.setDescription(`:musical_note: Teraz gramy [${newSong.name}](${newSong.url})`)
			.setColor(queue.guild.me.displayHexColor)
		
		queueChannel.send({embeds:[embed]}).then(msg => {
			queue.setData({
				channelId: queueChannel.id,
				songMessageId: msg.id
			});
		});
	}
}