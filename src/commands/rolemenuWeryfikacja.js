/**
 * weryfikacja reaction roles command
 */
const {MessageEmbed,MessageActionRow,MessageButton} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'rolemenuweryfikacja',
    aliases: [],
    execute(message, args, client) {
        //code
        if (message.member.user.id === "443657012769849366" || "476122334747557904") {
            const embed = new MessageEmbed()
                .setTitle('Weryfikacja')
                .setDescription('Kliknij  :white_check_mark:  aby przejśc weryfikacje Anty-Bot i otrzymać dostęp do serwera. Weryfikacja oznacza zapoznanie sie i akceptacje regulaminu.')
                .setColor('GREEN')

                const row = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId('weryfikacjaButton')
                    .setStyle('SECONDARY')
                    .setLabel('✅')
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