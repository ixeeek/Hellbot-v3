/**
 * main reaction roles command
 */
const {MessageEmbed,MessageActionRow,MessageButton} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'rolemenumain',
    aliases: [],
    execute(message, args, client) {
        //code
        if (message.member.user.id === "443657012769849366" || "476122334747557904") {
            const embed = new MessageEmbed()
                .setTitle('Role do wyboru')
                .setColor('BLUE')
                .addFields(
                    {name:'Płeć', value:'👨 - Chłopak\n👧 - Dziewczyna', inline:true},
                    {name:'Wiek', value:'👶 - 12-\n🧒 - 12+\n👦 - 14+\n🧑 - 16+\n🧓 - 18+', inline:true},
                    {name:'Platformy', value:'🖥 - PC\n📱 - Telefon\n<:playstation:903998254864289912> - PS\n<:xbox:903998255099150336> - XBOX\n<:nintendo:903998254272884808> - Nintendo', inline:true}
                )
            
            const row1 = new MessageActionRow()
            .addComponents(
                //chlopak
                new MessageButton()
                    .setCustomId('mainButton1')
                    .setStyle('SECONDARY')
                    .setLabel('Chłopak')
                    .setEmoji('👨'),
                //dziewczyna
                new MessageButton()
                    .setCustomId('mainButton2')
                    .setStyle('SECONDARY')
                    .setLabel('Dziewczyna')
                    .setEmoji('👧'),
            );
            const row2 = new MessageActionRow()
            .addComponents(
                //12-
                new MessageButton()
                    .setCustomId('mainButton3')
                    .setStyle('SECONDARY')
                    .setLabel('12-')
                    .setEmoji('👶'),
                //12+
                new MessageButton()
                    .setCustomId('mainButton4')
                    .setStyle('SECONDARY')
                    .setLabel('12+')
                    .setEmoji('🧒'),
                //14+
                new MessageButton()
                    .setCustomId('mainButton5')
                    .setStyle('SECONDARY')
                    .setLabel('14+')
                    .setEmoji('👦'),
                //16+
                new MessageButton()
                    .setCustomId('mainButton6')
                    .setStyle('SECONDARY')
                    .setLabel('16+')
                    .setEmoji('🧑'),
                //18+
                new MessageButton()
                    .setCustomId('mainButton7')
                    .setStyle('SECONDARY')
                    .setLabel('18+')
                    .setEmoji('🧓'),
            );
            const row3 = new MessageActionRow()
            .addComponents(
                //
                new MessageButton()
                .setCustomId('mainButtonPc')
                .setStyle('SECONDARY')
                .setLabel('PC')
                .setEmoji('🖥'),
                //
                new MessageButton()
                .setCustomId('mainButtonTel')
                .setStyle('SECONDARY')
                .setLabel('Telefon')
                .setEmoji('📱'),
                //
                new MessageButton()
                .setCustomId('mainButtonPs')
                .setStyle('SECONDARY')
                .setLabel('PS')
                .setEmoji('903998254864289912'),
                //
                new MessageButton()
                .setCustomId('mainButtonXbox')
                .setStyle('SECONDARY')
                .setLabel('XBOX')
                .setEmoji('903998255099150336'),
                //
                new MessageButton()
                .setCustomId('mainButtonNintendo')
                .setStyle('SECONDARY')
                .setLabel('Nintendo')
                .setEmoji('903998254272884808'),
            )
            
            message.delete()
            message.channel.send({
                embeds: [embed], components: [row1, row2, row3]
            })
        } else {
            return
        }
    }
}