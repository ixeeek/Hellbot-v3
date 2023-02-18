 const { channels } = require('../../data/data.json');
 module.exports = {
	 name: 'guildMemberRemove',
	 execute(member) {
		 member.guild.channels.cache.get(channels.membercountchannel).edit({
			 name: `👥︱Użytkownicy: ${member.guild.memberCount}`
		 });
	 }
 }