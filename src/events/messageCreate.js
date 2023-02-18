const log4js = require('log4js');
const { noPingReply } = require('../../utils');
module.exports = {
	name: 'messageCreate',
	execute(message, client) {
		//autoreactions
		const data = require('../../data/data.json');
		//memy
		if(message.channel.id === data.channels.memychannel) {
			if(message.attachments.size > 0 || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('#mem')) {
				message.react(data.emotes.upvote)
				message.react(data.emotes.downvote)
				message.react(data.emotes.cringe)
				message.react(data.emotes.kekw)
			};
		//memy nsfw
		} else if(message.channel.id === data.channels.memynsfwchannel) {
			if(message.attachments.size > 0 || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('#mem')) {
				message.react(data.emotes.upvote)
				message.react(data.emotes.downvote)
				message.react(cringe)
				message.react(data.emotes.kekw)
			};
		};


		//automod
		let admRole = message.guild.roles.cache.find(r => r.id === data.roles.administracja);
		if(message.author.bot || !message.member.roles.cache.has(admRole.id)) {
			for(let badWord of data.badWords) {
				if(message.content.toLowerCase().includes(badWord)) {
					if(message.author.bot) return;
					message.delete()
					const badwordEmbed = new MessageEmbed()
						.setDescription(`:warning:  Słowo \`${badWord}\` jest zabronione na tym serwerze!`)
						.setColor('RED')
						.setTimestamp()
					
					return message.author.send({embeds: [badwordEmbed]}).catch(e => {
						if(e) return console.log('blocked bot? disabled dms?');
					});
				}
			}
		};

		
		//command handling
		const commandLogger = log4js.getLogger('commands');
		//start
		if (!message.content.startsWith(data.config.prefix) || message.author.bot) return;

		const args = message.content.slice(data.config.prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		try {
			command.execute(message, args, client);
			commandLogger.info(`${command.name.toUpperCase()} | used by: ${message.member.user.tag} | in channel: #${message.channel.name} | guild: ${message.guild.name}`);
		} catch (error) {
			commandLogger.error(`${command.name.toUpperCase()} | "${error}"`)
			const { EmbedBuilder } = require('discord.js');

			const userErrorEmbed = new EmbedBuilder()
				.setTitle(':x: ERROR!')
				.setDescription(`\`\`\`${error}\`\`\``)
				.setTimestamp()
				.setFooter({text:'Błąd został zgłoszony do Administracji, przepraszamy :('})
				.setColor('Red')
	
			noPingReply({message: message, embed: userErrorEmbed});

			var errorsChannel = message.guild.channels.cache.get(data.channels.erorsChannel);
			const staffErrorEmbed = new EmbedBuilder()
				.setTitle(`Error in: ${command.name.toUpperCase()}`)
				.setDescription(`${error}`)
				.setColor('Red')
				.setTimestamp()

			errorsChannel.send({
				content: `<@&${data.roles.hellbotTeam}>`,
				embeds: [staffErrorEmbed]
			});
			console.error(error);
		};
	}
}
