/**
 * guildMemberAdd
 */
const cnl = require('../../data/channels.json');
const {MessageEmbed, MessageButton} = require('discord.js');
module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const welcomeChannel = cnl.welcomechannel;

        const embed = new MessageEmbed()
            .setDescription(`Witaj ${member} na **hellup.pl**! Jest nas już **${member.guild.memberCount}**`)
            .setColor(member.guild.me.displayHexColor)
            
        member.guild.channels.cache.get(welcomeChannel).send({embeds: [embed]});
        member.guild.channels.cache.get(cnl.membercountchannel).edit({
            name: `👥︱Użytkownicy: ${member.guild.memberCount}`
        })  
    }
}