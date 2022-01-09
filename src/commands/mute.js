/**
 * mute command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const moment = require('moment');
module.exports = {
    name: 'mute',
    usage: 'mute <@użytkownik> <czas> [powód]',
    permission: 'MUTE_MEMBERS',
    execute(message, args) {
        const db = require('../../data/maindata.json');
        var casenumber = Number(db.casenumber);

        //vars
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        var time = args[1];
        var reason = args.slice(2).join(' ') || 'nie podano';
        let role = message.guild.roles.cache.find(role => role.name === "muted");

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
        if(!time) return message.reply({
            content: 'Podaj prawidłowy czas muta!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(target.id === message.member.id) return message.reply({
            content: 'Nie możesz zmutować samego siebie!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply({
            content: 'Nie możesz zmutować tego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(target.roles.cache.has(role.id)) return message.reply({
            content: 'Ten użytkownik jest już zmutowany!',
            allowedMentions: {
                repliedUser: false
            }
        });

        //muted until
        var muteduntil = moment(Date.now() + ms(time)).format('DD/MM/YY HH:mm:ss');

        rsn = `${reason} | Czas: ${time} | Moderator: ${message.member.user.tag} | Zmutowano do: ${muteduntil}`;
        target.roles.add(role.id, rsn).catch(err => {
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
                .setColor('BLUE')
                .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** mute\n**Powód:** ${reason}\n**Czas muta:** ${time}\n**Unmute:** ${muteduntil}`)
                .setFooter(`Case: #${casenumber}`)

            logs.send({embeds: [logembed]})

            message.reply({
                content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie zmutowano **${target.user.tag}**`,
                allowedMentions: {
                    repliedUser: false
                }
            });
            target.send(`\`Zostałeś zmutowany!\`\n**Moderator:** ${message.member.user.tag}\n**Powód:** ${reason}\n**Czas muta:** ${time}\n**Unmute:** ${muteduntil}`).catch(err => {if(err) console.log('Mute message wasnt send!')})
            console.log(`Wyciszono ${target.user.tag} - ${target.user.id} na ${time} za ${reason}`);

            setTimeout(() => {
                rsn = 'Czas muta upłynął!';
                target.roles.remove(role.id, rsn)
            }, ms(time))
        })

        //casenumber update
        var newcasenumber = String(casenumber+1);
        db.casenumber = newcasenumber;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });
    }
}