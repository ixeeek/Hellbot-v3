/**
 * ban command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'ban',
    usage: 'ban <@użytkownik/id> [powód]',
    permission: 'BAN_MEMBERS',
    async execute(message, args) {
        const db = require('../../data/maindata.json');
        let casenumber = Number(db.casenumber);

        //vars
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ') || 'nie podano';
        
        //logging
        const log4js = require('log4js');
        const commandLogger = log4js.getLogger('commands');
        const userLogger = log4js.getLogger('users');
        const consoleLog = log4js.getLogger('console');
        //commandLogger.info(`${command.name.toUpperCase()} :: ${message.member.user.tag}`)

        //code
        if(!message.member.permissions.has(module.exports.permission)) {
            const wait = require('node:timers/promises').setTimeout;
            message.reply({
            content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``,
            allowedMentions: {
                repliedUser: false
            }});
            await wait(10);
            return commandLogger.warn(`${module.exports.name.toUpperCase()} | ${message.member.user.tag} was denied to use command (noPermission)`)
        }
        if(!target) return message.reply({
            content: 'Podaj prawidłowego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(target.id === message.member.id) return message.reply({
            content: 'Nie możesz zbanować samego siebie!',
            allowedMentions: {
                repliedUser: false
            }
        }); 
        if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply({
            content: 'Nie możesz zbanować tego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(!target.bannable) return message.reply({
            content: 'Bot nie może zbanować tego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });

        const rsn = `${reason} | Moderator: ${message.member.user.tag}`;
        target.ban({reason:rsn}).catch(err => {
            if(err) return message.reply(`\`\`\`${err}\`\`\``);
        }).then(() => {
            //logchannel
            let cnl = require('../../data/channels.json');
            let logs = message.guild.channels.cache.get(cnl.logschannel);

            //logembed
            const logembed = new MessageEmbed()
                .setAuthor(`${message.member.user.tag}`, `${message.member.user.avatarURL({dynamic: true})}`)
                .setTimestamp()
                .setColor('RED')
                .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** ban\n**Powód:** ${reason}`)
                .setFooter(`Case: #${casenumber}`)

            logs.send({embeds: [logembed]})
            message.reply({
                content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie zbanowano **${target.user.tag}**`,
                allowedMentions: {
                    repliedUser: false
                }
            });

            userLogger.info(`BAN: ${target.user.tag} - ${target.user.id} | reason: ${reason} | moderator: ${message.member.user.tag}`);
            consoleLog.info(`BAN: ${target.user.tag} - ${target.user.id} | reason: ${reason} | moderator: ${message.member.user.tag}`);
            message.guild.channels.cache.get(cnl.membercountchannel).edit({
                name: `👥︱Użytkownicy: ${message.guild.memberCount}`
            })
        })

        //casenumber update
        db.casenumber = String(casenumber + 1);
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });
    }
}