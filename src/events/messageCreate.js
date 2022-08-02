/**
 * messageCreate event
 */
const config = require('../../data/config.json');
const {MessageEmbed, ReactionUserManager} = require('discord.js');
const fs = require('fs');
const request = require('request');
const log4js = require('log4js');
module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        //code

        //autoreactions
        //start
        //vars
        const cnl = require('../../data/channels.json');
        const roles = require('../../data/roles.json');
        const data = require('../../data/maindata.json');

        let upvote = '779116005284642857';
        let downvote = '779116034794979359';
        let plusjeden = '837260568351997993';
        let munusjeden = '837260568855183380';
        let cringe = '837262159926263808';
        let kekw = '837262841375490087';
        let adrian = '955605738569486407';

        //memy
        if(message.channel.id === cnl.memychannel) {
            if(message.attachments.size > 0 || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('#mem')) {
                message.react(upvote)
                message.react(downvote)
                message.react(cringe)
                message.react(kekw)
            };
        //memy nsfw
        } else if(message.channel.id === cnl.memynsfwchannel) {
            if(message.attachments.size > 0 || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('#mem')) {
                message.react(upvote)
                message.react(downvote)
                message.react(cringe)
                message.react(kekw)
            };
        };
        //end


        //emotki
        // if(message.channel.id === cnl.emotkiChannel) {
        //     if(message.author.bot) return;
        //     if(message.attachments.size === 0) return message.delete()
        //     const emotkaEmbed = new MessageEmbed()
        //         .setFooter(`Propozycja od: ${message.member.user.tag}`)
        //         .setColor(message.guild.me.displayHexColor)
        //     if(message.attachments.size > 1) {
        //         message.delete()
        //         return message.channel.send('Możesz wysłać tylko **jedną** emotke naraz.').then(msg => {
        //             setTimeout(() => {
        //                 return msg.delete().catch(e => {if(e) return})
        //             }, 10000);
        //         }) 
        //     } else {
        //         emotkaEmbed.setTitle(`Propozycja nazwy: ${message.content ? message.content : 'brak :)'}`);
        //         const attachment = message.attachments.first();
        //         if(!attachment.name.endsWith('.png') && !attachment.name.endsWith('.jpg') && !attachment.name.endsWith('.gif')) {
        //             message.delete()
        //             return message.channel.send('Obsługiwane formaty to: `.png`, `.jpg`, `.gif`').then(msg => {
        //                 setTimeout(() => {
        //                     return msg.delete().catch(e => {if(e) return})
        //                 }, 10000);
        //             })                     
        //         };
        //         if(attachment.height > 512 | attachment.width > 512) {
        //             message.delete()
        //             return message.channel.send('Maksymalny rozmiar emotki to 512x512px.').then(msg => {
        //                 setTimeout(() => {
        //                     return msg.delete().catch(e => {if(e) return})
        //                 }, 10000);
        //             }) 
        //         };
        //         var i = attachment.url;
        //         var emoteSystemLastId = Number(data.emoteSystemLastId)
        //         var newEmoteSystemId = String(emoteSystemLastId+1);
        //         data.emoteSystemLastId = newEmoteSystemId;
        //         fs.writeFile('./data/maindata.json', JSON.stringify(data, null, 2), function writeJSON(err) {
        //             if (err) return console.log(err);
        //         }); 
        //         console.log('zapisywanie emotki done')
        //         var newAttachemt = `${newEmoteSystemId}.${attachment.name.endsWith('.png') ? 'png' : attachment.name.endsWith('.jpg' ? 'jpg' : 'gif')}`;
        //         request(attachment.url).pipe(fs.createWriteStream(`./data/emotes/${newEmoteSystemLastId}.${attachment.name.endsWith('.png') ? 'png' : attachment.name.endsWith('.jpg') ? 'jpg' : 'gif'}`))
        //         console.log(newAttachemt)
        //         emotkaEmbed.setImage(`attachment://${newAttachemt}`);
        //         message.channel.send({embeds: [emotkaEmbed], files: [`./data/emotes/${newAttachemt}`]}).then(msg => {
        //             msg.react(upvote)
        //             msg.react(downvote)
        //         });
        //         //message.delete();
        //     };
        // };


        //automod
        let admRole = message.guild.roles.cache.find(r => r.id === roles.administracja);
        if(message.author.bot || !message.member.roles.cache.has(admRole.id)) {
            for(let badWord of data.badWords) {
                if(message.content.toLowerCase().includes(badWord)) {
                    if(message.author.bot) return;
                    message.delete()
                    const wait = require('node:timers/promises').setTimeout;
                    wait(10)
                    const embed = new MessageEmbed()
                        .setDescription(`:warning:  Słowo \`${badWord}\` jest zabronione na tym serwerze!`)
                        .setColor('RED')
                        .setTimestamp()
                    
                    return message.author.send({embeds: [embed]}).catch(e => {
                        if(e) return console.log('blocked bot? disabled dms?');
                    });
                }
            }
        };

        //end


        //command handling
        const commandLogger = log4js.getLogger('commands');
        //start
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);

        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            command.execute(message, args, client);
            commandLogger.info(`${command.name.toUpperCase()} | used by: ${message.member.user.tag} | in channel: #${message.channel.name} | guild: ${message.guild.name}`);
        } catch (error) {
            commandLogger.error(`${command.name.toUpperCase()} | "${error}"`)
            const {MessageEmbed} = require('discord.js');

            const embed = new MessageEmbed()
                .setTitle(':x: ERROR!')
                .setDescription(`\`\`\`${error}\`\`\``)
                .setTimestamp()
                .setFooter('Błąd został zgłoszony do Administracji, przepraszamy :(')
                .setColor('RED')
    
            message.reply({
                embeds: [embed],
                allowedMentions: {
                    repliedUser: false
                }
            });
            var errorsChannel = message.guild.channels.cache.get('972445809117376583');
            const errorEmbed = new MessageEmbed()
                .setTitle(`Error in: ${command.name.toUpperCase()}`)
                .setDescription(`${error}`)
                .setColor('RED')
                .setTimestamp()

            errorsChannel.send({
                content: `<@&${roles.hellbotTeam}>`,
                embeds:[errorEmbed]
            })
        }
        //end
    }
}
