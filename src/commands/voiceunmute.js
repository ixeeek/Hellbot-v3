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
     execute(message, args) {
         const db = require('../../data/maindata.json') || message.guild.members.cache.get(args[0]);
         var casenumber = Number(db.casenumber);
 
         //vars
         const target = message.mentions.members.first();
         let role = message.guild.roles.cache.find(role => role.name === "voicemute");
  
         //code
         if(!message.member.permissions.has(module.exports.permission)) return message.reply(`Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``);
         if(!target) return message.reply('Podaj prawidłowego użytkownika!');
         if(target.id === message.member.id) return message.reply('Nie możesz odmutować samego siebie!');         
         if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply('Nie możesz odmutować tego użytkownika!');
         if(!target.roles.cache.has(role.id)) return message.reply('Ten użytkownik nie jest zmutowany!');
 
         rsn = `Moderator: ${message.member.user.tag}`;
         target.roles.remove(role.id, rsn).catch(err => {
             if(err) return message.reply(`\`\`\`${err}\`\`\``)
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
 
             message.reply(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie odmutowano **${target.user.tag}**`);
         })
 
         //casenumber update
         var newcasenumber = String(casenumber+1);
         db.casenumber = newcasenumber;
         fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
             if (err) return console.log(err);
         });        
 
     }
 }