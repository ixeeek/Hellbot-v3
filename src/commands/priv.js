const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const log4js = require('log4js');
const fs = require('node:fs');
const { noPingReply } = require('../../utils');
module.exports = {
	name: 'priv',
	usage: 'priv <komenda> [argunemt]',
	async execute(message, args) {
		const cmd = args[0]; //first message arg as command
		let cmdList = ["add", "remove", "addtemp", "list"];   
		if(!cmd) return noPingReply({message: message, content: `Podaj komende!\nLista komend: \`${cmdList.join(', ')}\``});

		//logs
		const privLog = log4js.getLogger('privVoice');


		let memberPrivChannel = message.guild.channels.cache.find(c => c.name === `PRIV | ${message.member.user.username}`); //get member priv channel
		if(!memberPrivChannel || memberPrivChannel === undefined) {
			privLog.info(`${message.member.user.tag} tried to use command without private channel`)
			return noPingReply({message: message, content: `Nie posiadasz prywatnego kanału głosowego!`});
		};

		//COMMANDS
		const privOwner = message.member.user.id;
		var userPrivVoiceDatabase = require(`../../data/privVoice.json`);
		switch(cmd) {
			case "list":
				function callback(addedMembersString) {
					const addedMembersEmbed = new EmbedBuilder()
						.setAuthor({name:`${message.member.user.tag} - Kanał prywatny`, iconURL:`${message.member.user.avatarURL({dynamic: true})}`})
						.setColor(message.guild.members.me.displayHexColor)
						.setTimestamp()
						.addFields({name: 'Dodane osoby:', value: addedMembersString});

					noPingReply({message: message, embed: addedMembersEmbed})
				};

				var addedMembersString = "";
				var loopCounter = 0;
				if(memberPrivChannel.permissionOverwrites.cache.size == 2) {
					addedMembersString += `Nikogo nie dodałeś/aś jeszcze do swojego prywatnego kanału, możesz to zrobić komendą: \`.priv add <nick>\` lub \`.priv addtemp <nick>\`.`
					callback(addedMembersString);
					return;
				} else {
					memberPrivChannel.permissionOverwrites.cache.forEach(addedMember => {
						if(addedMember.type == 0) return;
						if(addedMember.id == privOwner) return;
						message.guild.members.fetch(addedMember.id).then(addedMemberObject => {
							addedMembersString += `<@${addedMember.id}> (${addedMemberObject.user.tag})\n`;
							loopCounter++;
							if(loopCounter == memberPrivChannel.permissionOverwrites.cache.size-2) callback(addedMembersString);
						});
					});
				};
				break


			case "add":
				const memberToAdd = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
				if(!memberToAdd) return noPingReply({message: message, content: `Podaj użytkownika, którego chcesz dodać do prywatnego kanału!`});
				if(memberToAdd.id === message.member.id) return noPingReply({message: message, content: `To twój kanał, jesteś już do niego dodany :)`});   
				if(memberPrivChannel.permissionsFor(memberToAdd).has(PermissionFlagsBits.ViewChannel)) return noPingReply({message: message, content: `Ten użytkownik jest już dodany do prywatnego kanału!`});

				memberPrivChannel.permissionOverwrites.edit(memberToAdd, { //creating channel permission overwrite
					ViewChannel: true
				});
				privLog.info(`${message.member.user.tag} added ${memberToAdd.user.tag} to their private channel (${memberPrivChannel.name})`) //logging adding member to priv channel


				//adding member to priv voice channel database
				try { //if member has already priv voice channel array just add member to it
					userPrivVoiceDatabase[privOwner].push(memberToAdd.id);
				} catch(error) { //if not
					userPrivVoiceDatabase[privOwner] = []; //create array
					userPrivVoiceDatabase[privOwner].push(memberToAdd.id); //and then add member to it
				};
				
				fs.writeFile(`./data/privVoice.json`, JSON.stringify(userPrivVoiceDatabase, null, 2), function writeJSON(err) { //writing database
					if (err) return console.log(err);
				});

				return noPingReply({message: message, content: `:white_check_mark:  Dodano **${memberToAdd.user.tag}** do prywatnego kanału`});


			case "addtemp":
				const memberToTempAdd = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
				if(!memberToTempAdd) return noPingReply({message: message, content: `Podaj użytkownika, którego chcesz dodać do prywatnego kanału!`});
				if(memberToTempAdd.id === message.member.id) return noPingReply({message: message, content: `To twój kanał, jesteś już do niego dodany :)`});  
				if(memberPrivChannel.permissionsFor(memberToTempAdd).has(PermissionFlagsBits.ViewChannel)) return noPingReply({message: message, content: `Ten użytkownik jest już dodany do prywatnego kanału!`});

				memberPrivChannel.permissionOverwrites.edit(memberToTempAdd, { //creating channel permission overwrite
					ViewChannel: true
				});
				privLog.info(`${message.member.user.tag} added temporary ${memberToTempAdd.user.tag} to their private channel (${memberPrivChannel.name})`) //logging adding member to priv channel

				return noPingReply({message: message, content: `:white_check_mark:  Dodano tymczasowo **${memberToTempAdd.user.tag}** do prywatnego kanału`});


			case "remove":
				const memberToRemove = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
				if(!memberToRemove) return noPingReply({message: message, content: `Podaj użytkownika, którego chcesz usunąć z prywatnego kanału!`});
				if(memberToRemove.id === message.member.id) return noPingReply({message: message, content: `To twój kanał, nie możesz się z niego usunąc...`});
				if(!memberPrivChannel.permissionsFor(memberToRemove).has(PermissionFlagsBits.ViewChannel)) return noPingReply({message: message, content: `Tego użytkownika nie ma dodanego do prywatnego kanału!`});
				
				//removing member from voice channel databse
				var userPrivVoiceDatabase = require(`../../data/privVoice.json`); //getting priv voice database

				const itemToDeleteIndex = userPrivVoiceDatabase[privOwner].indexOf(memberToRemove); //getting index of user to delete position in array
				userPrivVoiceDatabase[privOwner].splice(itemToDeleteIndex, 1); //deleting member from array using index from above function

				fs.writeFile(`./data/privVoice.json`, JSON.stringify(userPrivVoiceDatabase, null, 2), function writeJSON(err) { //writing database
					if (err) return console.log(err);
				});


				memberPrivChannel.permissionOverwrites.delete(memberToRemove, { //creating channel permission overwrite
					ViewChannel: true
				});
				privLog.info(`${message.member.user.tag} removed ${memberToRemove.user.tag} from their private channel (${memberPrivChannel.name})`) //logging removing member from priv channel


				//kicking member from channel
				var channelMembers = []; //defining array to store voice members
				memberPrivChannel.members.forEach(cnlMember => { //getting all voice channel members to array
					channelMembers.push(cnlMember.id)
				});
				if(channelMembers.includes(memberToRemove.id)) memberToRemove.voice.disconnect(); //if member is in channel, kick

				return noPingReply({message: message, content: `:white_check_mark:  Usunięto **${memberToRemove.user.tag}** z prywatnego kanału`});


			default:
				return noPingReply({message: message, content: `Niepoprawna komenda!\nLista komend: \`${cmdList.join(', ')}\``});
				break
		}
	}
};