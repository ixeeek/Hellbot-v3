const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'error',
	execute(error, queue, client) {
		console.log(error)
		const queueChannel = client.channels.cache.find(c => c.id === queue.data.channelId);

		const embed = new EmbedBuilder()
			.setTitle(':x: ERROR!')
			.setDescription(`\`\`\`${error}\`\`\``)
			.setTimestamp()
			.setFooter({text:'Błąd został zgłoszony do Administracji, przepraszamy :('})
			.setColor('RED')

		queueChannel.send({embeds:[embed]});
	}
}