/**
 * warnings command
 */
const {MessageEmbed} = require('discord.js');
const warndb = require('quick.db');

module.exports = {
    name: 'warnings',
    usage: 'warnings <@użytkownik>',
    aliases: ['warns'],
    async execute(message, args) {
        //vars
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const number = warndb.fetch(`number.${target.id}.${message.guild.id}`);
        const warnInfo = warndb.fetch(`info.${target.id}.${message.guild.id}`);

        //code
        if(!number || !warnInfo || warnInfo === []) return message.reply('Użytkownik nie ma żadnych ostrzeżeń!');

        const embed = new MessageEmbed()
            .setAuthor(`${target.user.tag} (${target.id})`, `${target.user.avatarURL({dynamic: true})}`)
            .setColor(message.guild.members.cache.get(target.id).roles.highest.color)
            .setTimestamp()

        for(let warns of warnInfo) {
            embed.addField(`ID: ${warns.id}`, `**Powód:** ${warns.reason}\n**Moderator:** ${warns.moderator}`)
        };
        message.reply({
            embeds: [embed],
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}
