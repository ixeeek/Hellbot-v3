/**
 * guildMemberAdd
 */
const cnl = require('../../data/channels.json');
const blacklist = require('../../data/blacklist.json');
const {MessageEmbed, MessageButton} = require('discord.js');
module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        //code
        if(blacklist.hellup.includes(member.user.id)) {
            member.ban({reason:'Blacklisted user - Autoban'}).catch(e => {
                if(e) console.log(e);
            });
            var logs = member.guild.id.channels.cache.get(cnl.logschannel);
            const db = require('../../data/maindata.json');
            var casenumber = Number(db.casenumber);
            console.log(logs)

            //logembed
            const logembed = new MessageEmbed()
                .setAuthor(`Blacklist`)
                .setTimestamp()
                .setColor('DARK_RED')
                .setDescription(`**Użytkownik:** ${member.user.tag} (${member.id})\n**Akcja:** blacklist ban`)
                .setFooter(`Case: #${casenumber}`)

            logs.send({embeds: [logembed]})

            //casenumber update
            var newcasenumber = String(casenumber+1);
            db.casenumber = newcasenumber;
            fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
                if (err) console.log(err);
            });   
            return
        };

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