/**
 * voicemute command
 */
 const {MessageEmbed} = require('discord.js');
 const fs = require('fs');
 const ms = require('ms');
 const moment = require('moment');
 module.exports = {
     name: 'voicemute',
     usage: 'voicemute <@użytkownik> <czas> [powód]',
     permission: 'MUTE_MEMBERS',
     aliases: ['vmute'],
     execute(message, args) {
         const db = require('../../data/maindata.json');
         var casenumber = Number(db.casenumber);
 
         //vars
         const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
         var time = args[1];
         var reason = args.slice(2).join(' ') || 'nie podano';
         let role = message.guild.roles.cache.find(role => role.name === "voicemute");
 
         //code
         if(!message.member.permissions.has(module.exports.permission)) return message.reply(`Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``);
         if(!target) return message.reply('Podaj prawidłowego użytkownika!');
         if(!time) return message.reply('Podaj prawidłowy czas muta!');
         if(target.id === message.member.id) return message.reply('Nie możesz zmutować samego siebie!');         
         if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply('Nie możesz zmutować tego użytkownika!');
         if(target.roles.cache.has(role.id)) return message.reply('Ten użytkownik jest już zmutowany!');
 
         //muted until
         var muteduntil = moment(Date.now() + ms(time)).format('DD/MM/YY HH:mm:ss');
 
         rsn = `${reason} | Czas: ${time} | Moderator: ${message.member.user.tag} | Zmutowano do: ${muteduntil}`;
         target.roles.add(role.id, rsn).catch(err => {
             if(err) return message.reply(`\`\`\`${err}\`\`\``)
         }).then(() => {
             //logchannel
             var cnl = require('../../data/channels.json');
             var logs = message.guild.channels.cache.get(cnl.logschannel);
             
             //logembed
             const logembed = new MessageEmbed()
                 .setAuthor(`${message.member.user.tag}`, `${message.member.user.avatarURL({dynamic: true})}`)
                 .setTimestamp()
                 .setColor('AQUA')
                 .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** voicemute\n**Powód:** ${reason}\n**Czas muta:** ${time}\n**Unmute:** ${muteduntil}`)
                 .setFooter(`Case: #${casenumber}`)
 
             logs.send({embeds: [logembed]})
 
 
             message.reply(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie zmutowano **${target.user.tag}**`);
             target.send(`\`Zostałeś zmutowany na kanałach głosowych!\`\n**Moderator:** ${message.member.user.tag}\n**Powód:** ${reason}\n**Czas muta:** ${time}\n**Unmute:** ${muteduntil}`).catch(err => {if(err) console.log('VoiceMute message wasnt send!')})
 
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