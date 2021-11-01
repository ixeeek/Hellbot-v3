/**
 * warn command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const warndb = require('quick.db');
const random_string = require('randomstring');
module.exports = {
    name: 'warn',
    usage: 'warn <@użytkownik> [powód]',
    permission: 'KICK_MEMBERS',
    async execute(message, args) {
        const db = require('../../data/maindata.json');
        var casenumber = Number(db.casenumber);
        
        //vars
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(' ') || 'nie podano';

        //code
        if(!message.member.permissions.has(module.exports.permission)) return message.reply(`Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``);
        if(!target) return message.reply('Podaj prawidłowego użytkownika!');        
        if(target.id === message.member.id) return message.reply('Nie możesz zwarnować samego siebie!');        
        if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply('Nie możesz zwarnować tego użytkownika!');


        //warnId
        let warnId = Number(db.warnId);
        //updating warnId
        var newWarnId = String(warnId+1);
        db.warnId = newWarnId;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });   

        
        warndb.push(`info.${target.id}.${message.guild.id}`,{moderator:message.author.tag, reason:reason, id:warnId});
        warndb.add(`number.${target.id}.${message.guild.id}`,1);

        //logchannel
        var cnl = require('../../data/channels.json');
        var logs = message.guild.channels.cache.get(cnl.logschannel);
        
        //logembed
        const logembed = new MessageEmbed()
            .setAuthor(`${message.member.user.tag}`, `${message.member.user.avatarURL({dynamic: true})}`)
            .setTimestamp()
            .setColor('YELLOW')
            .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** warn\n**Powód:** ${reason}\n**ID Warna:** ${warnId}`)
            .setFooter(`Case: #${casenumber}`)
        logs.send({embeds: [logembed]})

        message.reply(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie zwarnowano **${target.user.tag}**`);
        target.send(`:warning: \`Ostrzeżenie!\`\n**Moderator:** ${message.member.user.tag}\n**Powód:** ${reason}`).catch(err => {
            if(err) console.log('Warn message wasnt send!');
        })

        //casenumber update
        var newcasenumber = String(casenumber+1);
        db.casenumber = newcasenumber;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });   
    }
}