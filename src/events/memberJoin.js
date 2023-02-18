const { EmbedBuilder } = require('discord.js');
const { channels, roles, silentMembers } = require('../../data/data.json');
const muteDatabase = require('../../data/mutes.json');
module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
    //check muted members
    var mutedRole = member.guild.roles.cache.find(r => r.id == roles.muted);
    if(muteDatabase[member.id]) member.roles.add(mutedRole.id);

    //embed
		const welcomeEmbed = new EmbedBuilder()
			.setDescription(`Witaj ${member} na **hellup.pl**! Jest nas już **${member.guild.memberCount}**`)
			.setColor(member.guild.members.me.displayHexColor)

		member.guild.channels.cache.get(channels.membercountchannel).edit({ name: `👥︱Użytkownicy: ${member.guild.memberCount}` });
		if(silentMembers.includes(member.id)) return;
		member.guild.channels.cache.get(channels.welcomechannel).send({embeds: [welcomeEmbed]});
	}
}