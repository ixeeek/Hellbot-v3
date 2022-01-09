/**
 * kick command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'kick',
    usage: 'kick <@uzytkownik/id> [powod]',
    permission: 'KICK_MEMBERS',
    execute(message, args) {
        const db = require('../../data/maindata.json');
        var casenumber = Number(db.casenumber);

        //vars
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        var reason = args.slice(1).join(' ') || 'nie podano';

        //code
        if(!message.member.permissions.has(module.exports.permission)) return message.reply({
            content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``,
            allowedMentions: {
                repliedUser: false
            }
        });
        if(!target) return message.reply({
            content: 'Podaj prawidłowego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(target.id === message.member.id) return message.reply({
            content: 'Nie możesz wyrzucić samego siebie!',
            allowedMentions: {
                repliedUser: false
            }
        });    
        if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply({
            content: 'Nie możesz wyrzucić tego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(!target.kickable) return message.reply({
            content: 'Bot nie może wyrzucić tego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });

        rsn = `${reason} | Moderator: ${message.member.user.tag}`;
        target.kick(rsn).catch(err => {
            if(err) return message.reply({
                content: `\`\`\`${err}\`\`\``,
                allowedMentions: {
                    repliedUser: false
                }
            });
        }).then(() => {
            //logchannel
            var cnl = require('../../data/channels.json');
            var logs = message.guild.channels.cache.get(cnl.logschannel);

            //logembed
            const logembed = new MessageEmbed()
                .setAuthor(`${message.member.user.tag}`, `${message.member.user.avatarURL({dynamic: true})}`)
                .setTimestamp()
                .setColor('GOLD')
                .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** kick\n**Powód:** ${reason}`)
                .setFooter(`Case: #${casenumber}`)

            logs.send({embeds: [logembed]})
            message.reply({
                content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie wyrzucono **${target.user.tag}**`,
                allowedMentions: {
                    repliedUser: false
                }
            });
            console.log(`Wyrzucono ${target.user.tag} - ${target.user.id} za ${reason}`);
            
            message.guild.channels.cache.get(cnl.membercountchannel).edit({
                name: `👥︱Użytkownicy: ${message.guild.memberCount}`
            })
        })

        //casenumber update
        var newcasenumber = String(casenumber+1);
        db.casenumber = newcasenumber;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });
    }
}