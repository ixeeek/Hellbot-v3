const log4js = require('log4js');
const fs = require('node:fs');
const { EmbedBuilder, ChannelType } = require('discord.js');
module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState, newState, client) {
		//database
		const { config, channels:channelsIds } = require('../../data/data.json');

		//logs
		const privLog = log4js.getLogger('privVoice');


		//priv voice channels
		if(newState.channelId === channelsIds.privVoiceCreateChannel) {
			if(newState.channelId === oldState.channelId) return; //checking if newState channel is same as oldState channel to prevent bugging code and making 2 channels instead of 1
			let memberExistingChannel = newState.guild.channels.cache.find(c => c.name === `PRIV | ${newState.member.user.username}`); //check if member channel already exists
			if(memberExistingChannel) return newState.member.voice.setChannel(memberExistingChannel); //if member channel exists (memberExistingChannel) move member to this channel


			newState.guild.channels.create(`PRIV | ${newState.member.user.username}`, { //create new channel
				type: ChannelType.GuildVoice, //channel type
				parent: channelsIds.privVoiceCategory //channel category
			}).then(cnl => {
				newState.member.voice.setChannel(cnl); //move member to created channel 
				
				cnl.permissionOverwrites.create(newState.member, { //creating channel permission overwrite
					viewChannelPermission: true
				});
				var userPrivVoiceDatabase = require(`../../data/privVoice.json`); //reading priv voice database
				if(!userPrivVoiceDatabase[newState.member.id]) {
					const privInfoEmbed = new EmbedBuilder()
						.setDescription('Wygląda na to, że korzystasz z naszego systemu prywatnych kanałów, poraz pierwszy. Poniżej lista kilku przydatnych komend dot. systemu PrivVoice.')
						.addFields(
							{name: 'Dodawanie użytkowników:', value: '`priv add <@nick>` - dodaje użytkownika do kanału.\n`priv addtemp <@nick>` - dodaje użytkownika tymczasowo (do zakończenia danej sesji - zostawienia kanału pustego).', inline: false},
							{name: 'Usuwanie użytkowników', value: '`priv remove <@nick>` - usuwa użytkownika z kanału.'}
						)
						.setColor('Blue')
						.setFooter({text:'Pozdrawiamy, zespół hellup.pl'})

					newState.member.send({embeds: [privInfoEmbed]});
					userPrivVoiceDatabase[newState.member.id] = [];
					fs.writeFile(`./data/privVoice.json`, JSON.stringify(userPrivVoiceDatabase, null, 2), function writeJSON(err) { //writing database
						if (err) return console.log(err);
					});
				};
				try {
					userPrivVoiceDatabase[newState.member.id].forEach(newCnlMemberId => { //making loop to add all members included in database
						newState.member.guild.members.fetch(newCnlMemberId).then(memberToAdd => { //getting member from guild.members using their ID
							cnl.permissionOverwrites.edit(memberToAdd, { //creating channel permisison overwrite
								viewChannelPermission: true
							});
							privLog.info(`Added ${memberToAdd.user.username} to "PRIV | ${newState.member.user.username}" channel`)
						}).catch(e => {
							if(e) return;
						});
					})                    
				} catch(e) {
					//nothing 
				};
			});
			privLog.warn(`Created Priv Voice for ${newState.member.user.tag}`);
			return
		};

		//priv voice channel deleting
		if(oldState.channel && oldState.channel.name.startsWith('PRIV |')) { if(oldState.channel.members.size === 0) return oldState.channel.delete().then(deleted => {
			privLog.warn(`Deleted Priv Voice "${deleted.name}"`);
		})}; //checking&deleting channel if empty
	}
};