/**
 * guildMemberRemove
 */
 const cnl = require('../../data/channels.json');
 module.exports = {
     name: 'guildMemberRemove',
     execute(member) {
         member.guild.channels.cache.get(cnl.membercountchannel).edit({
             name: `👥︱Użytkownicy: ${member.guild.memberCount}`
         })  
     }
 }