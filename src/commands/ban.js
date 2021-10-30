/**
 * ban command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'ban',
    usage: 'ban <@użytkownik/id> [powód]',
    permission: 'BAN_MEMBERS',
    execute(message, args) {
        const db = require('../../data/maindata.json');
        var casenumber = Number(db.casenumber);

        //vars
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        var reason = args.slice(1).join(' ') || 'nie podano';
        
        //code
        if(!message.member.permissions.has(module.exports.permission)) return message.reply(`Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``);
        if(!target) return message.reply('Podaj prawidłowego użytkownika!');
        if(target.id === message.member.id) return message.reply('Nie możesz zbanować samego siebie!');        
        if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply('Nie możesz zbanować tego użytkownika!');
        if(!target.bannable) return message.reply('Bot nie może zbanować tego użytkownika!');

        rsn = `${reason} | Moderator: ${message.member.user.tag}`;
        target.ban({reason:rsn}).catch(err => {
            if(err) return message.reply(`\`\`\`${err}\`\`\``);
        }).then(() => {
            //logchannel
            var cnl = require('../../data/channels.json');
            var logs = message.guild.channels.cache.get(cnl.logschannel);

            //logembed
            const logembed = new MessageEmbed()
                .setAuthor(`${message.member.user.tag}`, `${message.member.user.avatarURL({dynamic: true})}`)
                .setTimestamp()
                .setColor('RED')
                .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** ban\n**Powód:** ${reason}`)
                .setFooter(`Case: #${casenumber}`)

            logs.send({embeds: [logembed]})
            message.reply(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie zbanowano **${target.user.tag}**`);

            console.log(`Zbanowano ${target.user.tag} - ${target.user.id} za ${reason}`);
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