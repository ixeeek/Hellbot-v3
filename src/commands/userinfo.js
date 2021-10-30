/**
 * userinfo command
 */
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
module.exports = {
    name: 'userinfo',
    aliases: ['user', 'memberinfo', 'member'],
    execute(message, args) {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const roles = target.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);

        const creationDate = moment.utc(target.user.createdAt).format("DD/MM/YYYY")
        const joinDate = moment.utc(target.joinedAt).format("DD/MM/YYYY")

        let y = Date.now() - target.user.createdAt
        let x = Date.now() - target.joinedAt

        const userFor = Math.floor(y / 86400000)
        const serverFor = Math.floor(x / 86400000)

        const nick = target.nickname || 'None'

        const embed = new MessageEmbed()
            .setAuthor(`Informacje o ${target.user.tag}`, `${target.user.avatarURL({dynamic: true})}`)
            .setColor(target.displayHexColor || message.guild.me.displayHexColor)
            .addFields(
                {
                    name: 'Główne informacje',
                    value: `> **Nazwa:** ${target.user.username}\n> **Tag:** ${target.user.discriminator}\n> **ID:** ${target.id}\n> **Nick:** ${nick}`
                },
                {
                    name: 'Informacje o koncie',
                    value: `> **Konto stworzone:** ${creationDate}\n> **Użytkownik Discord'a przez:** ${userFor} dni\n> **Dołączył do serwera:** ${joinDate} (${serverFor} dni temu)`
                },
                {
                    name: 'Informacje o rolach',
                    value: `> **Liczba ról:** ${roles.length}\n> **Role:** ${roles.length < 50 ? roles.join(', ') : roles.length > 50 ? this.client.utils.trimArray(roles) : 'brak'}`
                }
                
            )

        message.reply({embeds: [embed]})
    }
}