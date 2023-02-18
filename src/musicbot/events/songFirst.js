const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'songFirst',
	execute(queue, song, client) {
		const queueChannel = client.channels.cache.find(c => c.id === queue.data.channelId);

		if(!song) {
			try {
				if(queue.size > 0) queue.skip()
			} catch(e) {
				queueChannel.send(':x:  Wystapil blad z odtworzeniem piosenki, spr�buj ponownie, jesli blad bedzie sie powtarzal, skontaktuj sie z administracja.')
				if(e) return;
			};
		};
		
		const embed = new EmbedBuilder()
			.setDescription(`:musical_note: Teraz gramy [${song.name}](${song.url})`)
			.setColor(queue.guild.members.me.displayHexColor)
		
		if(queue.data.songMessageId) queueChannel.messages.fetch(queue.data.songMessageId).then(msg => {
			if(msg) msg.delete();
		}).catch(e => {})
		queueChannel.send({embeds:[embed]}).then(msg => {
			queue.setData({
				channelId: queueChannel.id,
				songMessageId: msg.id
			});
		});
	}
}