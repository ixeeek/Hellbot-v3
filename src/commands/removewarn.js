/**
 * removewarn command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const warndb = require('quick.db');

module.exports = {
    name: 'removewarn',
    usage: 'removewarn <@użytkownik> [ID warna]',
    permission: 'KICK_MEMBERS',
    aliases: ['delwarn'],
    async execute(message, args) {
        const db = require('../../data/maindata.json');
        var casenumber = Number(db.casenumber);

        //vars
        const target = message.mentions.members.first();
        const id = args.slice(1).join(' ');

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
        }; 
        if(!target) return message.reply({
            content: 'Podaj prawidłowego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });  
        if(target.id === message.member.id) return message.reply({
            content: 'Nie możesz sam sobie usunąć warna!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply({
            content: 'Nie możesz usunąć warna temu użytkownikowi!',
            allowedMentions: {
                repliedUser: false
            }
        });

        let database = warndb.fetch(`info.${target.id}.${message.guild.id}`);
        if(!database || database === []) return message.reply({
            content: 'Użytkownik nie ma żadnych ostrzeżeń!',
            allowedMentions: {
                repliedUser: false
            }
        });

        //logchannel
        var cnl = require('../../data/channels.json');
        var logs = message.guild.channels.cache.get(cnl.logschannel);
        
        //logembed
        const logembed = new MessageEmbed()
            .setAuthor(`${message.member.user.tag}`, `${message.member.user.avatarURL({dynamic: true})}`)
            .setTimestamp()
            .setColor('DARK_YELLOW')
            .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** removewarn\n**ID Warna:** ${id || 'wszystkie'}`)
            .setFooter(`Case: #${casenumber}`)
        logs.send({embeds: [logembed]})

        userLogger.info(`REMOVEWARN: ${target.user.tag} - ${target.id} | warnId: ${id || 'all'} | moderator: ${message.member.user.tag}`);
        consoleLog.info(`REMOVEWARN: ${target.user.tag} - ${target.id} | warnId: ${id || 'all'} | moderator: ${message.member.user.tag}`);

        //casenumber update
        var newcasenumber = String(casenumber+1);
        db.casenumber = newcasenumber;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });   

        if(!id) {
            warndb.delete(`info.${target.id}.${message.guild.id}`)
            return message.reply({
                content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie usunieto wszystkie warny użytkownika!`,
                allowedMentions: {
                    repliedUser: false
                }
            });
        } else {
            if(!database.find(d => d.id === id)) return message.reply('Nie znaleziono podanego warna!');

            database.splice(database.findIndex(data => data.id === id), 1);

            if(database.length >= 1) {
                warndb.set(`info.${target.id}.${message.guild.id}`, database)
            } else {
                warndb.delete(`info.${target.id}.${message.guild.id}`)
            };
            message.reply({
                content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie usunięto warna!`,
                allowedMentions: {
                    repliedUser: false
                }
            });
        };
    }
}