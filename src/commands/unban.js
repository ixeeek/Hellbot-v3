/**
 * unban command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'unban',
    usage: 'unban <id>',
    permission: 'BAN_MEMBERS',
    async execute(message, args, client) {
        const db = require('../../data/maindata.json');
        var casenumber = Number(db.casenumber);

        //vars
        let target;

        //code
        if(!message.member.permissions.has(module.exports.permission)) return message.reply({
            content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``,
            allowedMentions: {
                repliedUser: false
            }
        });
        if(!message.guild.me.permissions.has(module.exports.permission)) return message.reply({
            content: 'Bot nie może odbanować tej osoby!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(target === message.member.id) return message.reply({
            content: 'Jak chcesz się odbanować jak nawet nie masz bana?',
            allowedMentions: {
                repliedUser: false
            }
        });

        try {
            target = await client.users.fetch(args[0]);
        } catch(error) {
            if(!target) return message.reply({
                content: 'Podaj prawidłowego użytkownika!',
                allowedMentions: {
                    repliedUser: false
                }
            });
        }

        try {
            await message.guild.bans.fetch(args[0]);
        } catch(error) {
            console.log(error)
            return message.reply({
                content: 'Ta osoba nie jest zbanowana!',
                allowedMentions: {
                    repliedUser: false
                }
            });
        }

        rsn = `Moderator: ${message.member.user.tag}`;
        message.guild.members.unban(target, rsn).catch(err => {
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
                .setColor('DARK_RED')
                .setDescription(`**Użytkownik:** ${target.tag} (${target.id})\n**Akcja:** unban`)
                .setFooter(`Case: #${casenumber}`)

            logs.send({embeds: [logembed]})
            message.reply({
                content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie odbanowano **${target.tag}**`,
                allowedMentions: {
                    repliedUser: false
                }
            });        
        })

        //casenumber update
        var newcasenumber = String(casenumber+1);
        db.casenumber = newcasenumber;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });
    }
}