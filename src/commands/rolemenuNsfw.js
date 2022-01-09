/**
 * nsfw reaction roles command
 */
const {MessageEmbed, MessageButton, MessageActionRow} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'rolemenunsfw',
    aliases: [],
    async execute(message, args, client) {
        //code
        if (message.member.user.id === "443657012769849366" || "476122334747557904") {
            const embed = new MessageEmbed()
                .setTitle('NSFW')
                .setDescription('Kliknij 🔞 aby otrzymać dosęp do kanału 18+')
                .setColor('RED')
            
            const row = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId('nsfwButton')
                    .setStyle('SECONDARY')
                    .setLabel('🔞')
                );

            message.delete()
            message.channel.send({
                embeds: [embed], components: [row]
            })
        } else {
            return
        }
    }
}