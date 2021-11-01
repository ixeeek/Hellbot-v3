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
    execute(message, args) {
        const db = require('../../data/maindata.json');
        var casenumber = Number(db.casenumber);

        //vars
        const target = message.mentions.members.first();
        const id = args.slice(1).join(' ');

        //code
        if(!message.member.permissions.has(module.exports.permission)) return message.reply(`Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``);
        if(!target) return message.reply('Podaj prawidłowego użytkownika!');        
        if(target.id === message.member.id) return message.reply('Nie możesz sam sobie usunąć warna!');
        if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply('Nie możesz usunąć warna temu użytkownikowi!');

        let database = warndb.fetch(`info.${target.id}.${message.guild.id}`);
        if(!database || database === []) return message.reply('Użytkownik nie ma żadnych ostrzeżeń!');

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

        
        if(!id) {
            warndb.delete(`info.${target.id}.${message.guild.id}`)
            return message.reply(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie usunieto wszystkie warny użytkownika!`)
        } else {
            if(!database.find(d => d.id === id)) return message.reply('Nie znaleziono podanego warna!');

            database.splice(database.findIndex(data => data.id === id), 1);

            if(database.length >= 1) {
                warndb.set(`info.${target.id}.${message.guild.id}`, database)
            } else {
                warndb.delete(`info.${target.id}.${message.guild.id}`)
            }
            message.reply(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie usunięto warna!`)
        };

        //casenumber update
        var newcasenumber = String(casenumber+1);
        db.casenumber = newcasenumber;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });   
    }
}