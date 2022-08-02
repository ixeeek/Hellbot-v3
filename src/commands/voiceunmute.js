/**
 * unmute command
 */
 const {MessageEmbed} = require('discord.js');
 const fs = require('fs'); 
 module.exports = {
     name: 'voiceunmute',
     usage: 'voiceunmute <@użytkownik>',
     permission: 'MUTE_MEMBERS',
     aliases: ['vunmute'],
     async execute(message, args) {
         const db = require('../../data/maindata.json') || message.guild.members.cache.get(args[0]);
         var casenumber = Number(db.casenumber);
 
         //vars
         const target = message.mentions.members.first();
         let role = message.guild.roles.cache.find(role => role.name === "voicemute");

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
            content: 'Nie możesz odmutować samego siebie!',
            allowedMentions: {
                repliedUser: false
            }
        });         
         if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply({
            content: 'Nie możesz odmutować tego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });
         if(!target.roles.cache.has(role.id)) return message.reply({
            content: 'Ten użytkownik nie jest zmutowany!',
            allowedMentions: {
                repliedUser: false
            }
        });
 
         rsn = `Moderator: ${message.member.user.tag}`;
         target.roles.remove(role.id, rsn).catch(err => {
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
                .setColor('DARK_AQUA')
                .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** voiceunmute`)
                .setFooter(`Case: #${casenumber}`)

            logs.send({embeds: [logembed]})

            message.reply({
                content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie odmutowano **${target.user.tag}**`,
                allowedMentions: {
                    repliedUser: false
                }
            });
            userLogger.info(`VOICEUNMUTE: ${target.user.tag} - ${target.user.id} | moderator: ${message.member.user.tag}`);
            consoleLog.info(`VOICEUNMUTE: ${target.user.tag} - ${target.user.id} | moderator: ${message.member.user.tag}`);
         })
 
         //casenumber update
         var newcasenumber = String(casenumber+1);
         db.casenumber = newcasenumber;
         fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
             if (err) return console.log(err);
         });        
 
     }
 }