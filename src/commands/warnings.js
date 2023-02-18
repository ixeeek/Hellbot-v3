const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const warnsDatabase = require('../../data/warns.json');
const { noPingReply } = require('../../utils');
const moment = require('moment');
module.exports = {
  name: 'warnings',
  aliases: ['warns'],
  usage: 'warnings [@uzytkownik]',
  permission: PermissionFlagsBits.KickMembers,
  async execute(message, args) {
    //vars
		var target = message.mentions.members.first() || message.member;

    //code
    if(target.id != message.member.id && !message.member.permissions.has(module.exports.permission)) target = message.member;
    if(!warnsDatabase[target.id] || JSON.stringify(warnsDatabase[target.id]) == '{}') return noPingReply({message: message, content: `Użytkownik nie ma żadnych ostrzeżeń!`});

    const warningsEmbed = new EmbedBuilder()
      .setAuthor({name: `${target.user.tag} (${target.user.id})`, iconURL: target.user.avatarURL({dynamic: true})})
      .setColor(target.displayHexColor == '#000000' ? message.guild.members.me.displayHexColor : target.displayHexColor)
			.setTimestamp()

    for(let warn in warnsDatabase[target.id]) {
      let warnObject = warnsDatabase[target.id][warn];
      warningsEmbed.addFields({name: `ID: ${warn}`, value: `**Powód:** ${warnObject.reason}\n**Moderator:** ${warnObject.moderator}\n**Data:** ${moment(warnObject.date).format('HH:mm:ss (DD/MM/YYYY)')}\n**Case:** #${warnObject.casenumber}`, inline: true});
    };

    noPingReply({message: message, embed: warningsEmbed});
  }
}