/**
 * nuke command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'nuke',
    permission: 'MANAGE_CHANNELS',
    async execute(message, args) {
        const db = require('../../data/maindata.json');
        var casenumber = Number(db.casenumber);

        //logging
        const log4js = require('log4js');
        const commandLogger = log4js.getLogger('commands');
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

        message.channel.clone({
            reason: `Moderator: ${message.member.user.tag}`
        }).then(channel => {
            channel.setPosition(message.channel.position)
            channel.send(`:white_check_mark: \`Case: #${casenumber}\` Pomyślnie wyczyszczono kanał!`)
            message.channel.delete(`Moderator: ${message.member.user.tag}`)
        })

        //logchannel
        var cnl = require('../../data/channels.json');
        var logs = message.guild.channels.cache.get(cnl.logschannel);
        
        //logembed
        const logembed = new MessageEmbed()
            .setAuthor(`${message.member.user.tag} (${message.member.user.id})`, `${message.member.user.avatarURL({dynamic: true})}`)
            .setTimestamp()
            .setColor('GREEN')
            .setDescription(`**Kanał:** #${message.channel.name} (${message.channel.id})\n**Akcja:** nuke`)
            .setFooter(`Case: #${casenumber}`)
        logs.send({embeds: [logembed]})
        console.log(`Wyczyszczono kanal ${message.channel.name}`);

        //casenumber update
        var newcasenumber = String(casenumber+1);
        db.casenumber = newcasenumber;
        fs.writeFile('./data/maindata.json', JSON.stringify(db, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
        });   
    }
}