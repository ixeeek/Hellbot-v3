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
        if(!message.member.permissions.has(module.exports.permission)) return message.reply(`Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``);
        if(!message.guild.me.permissions.has(module.exports.permission)) return message.reply('Bot nie może odbanować tej osoby!');
        if(target === message.member.id) return message.reply('Jak chcesz się odbanować jak nawet nie masz bana?');

        try {
            target = await client.users.fetch(args[0]);
        } catch(error) {
            if(!target) return message.reply('Podaj prawidłowego użytkownika!');
        }

        try {
            await message.guild.bans.fetch(args[0]);
        } catch(error) {
            console.log(error)
            return message.reply('Ta osoba nie jest zbanowana!')
        }

        rsn = `Moderator: ${message.member.user.tag}`;
        message.guild.members.unban(target, rsn).catch(err => {
            if(err) return message.reply(`\`\`\`${err}\`\`\``)
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
            message.reply(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie odbanowano **${target.tag}**`);            
        })

        //casenumber update
        var newcasenumber = String(casenumber+1);
        db.casenumber = newcasenumber;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });
    }
}