/**
 * blacklist command
 */
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'blacklist',
    usage: 'blacklist <list/add/remove> <@użytkownik/id>',
    permission: 'BAN_MEMBERS',
    async execute(message, args) {
        if(!message.member.permissions.has(module.exports.permission)) return message.reply({
            content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``,
            allowedMentions: {
                repliedUser: false
            }
        });


        let cmd = args[0];
        let cmds = ["list", "add", "remove"];
        if(!cmd) {
            return message.reply({
                content: 'Lista komend: `list`, `add`, `remove`',
                allowedMentions: {
                    repliedUser: false
                }
            });
        }
        if(!cmds.includes(cmd)) {
            return message.reply({
                content: 'Podaj prawidłową komende: `list`, `add`, `remove`',
                allowedMentions: {
                    repliedUser: false
                }
            });
        }


        const {hellup} = require('../../data/blacklist.json');
        if(!message.member.permissions.has(module.exports.permission)) return message.reply({
            content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``,
            allowedMentions: {
                repliedUser: false
            }
        });


        if(cmd === 'list') {
            if(hellup.length === 0 || !hellup) {
                return message.reply({
                    content: `Nie ma zblacklistowanych użytkowników, yay!`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            }
            const listEmbed = new MessageEmbed()
                .setDescription(`Mamy \`${hellup.length}\` zblacklistowanych użytkowników: \n\n${hellup.length < 30 ? hellup.join('\n') : hellup.length > 30 ? `${hellup.slice(0, 30).join('\n')}\n...\`${hellup.length-30}\` more` : 'database error'}`)
                .setColor('GREEN')

            return message.reply({
                embeds: [listEmbed],
                allowedMentions: {
                    repliedUser: false
                }
            });
        }

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || args[1];

        if(!target) return message.reply({
            content: 'Podaj prawidłowego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(target.id === message.member.id) return message.reply({
            content: 'Nie możesz zblacklistować samego siebie!',
            allowedMentions: {
                repliedUser: false
            }
        }); 
        if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply({
            content: 'Nie możesz zblacklistować tego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(!target.bannable) return message.reply({
            content: 'Bot nie może zbacklistować tego użytkownika!',
            allowedMentions: {
                repliedUser: false
            }
        });

        const {casenumber} = require('../../data/maindata.json');

        if(cmd === 'add') {
            if(hellup.includes(target.id)) return message.reply({
                content: 'Ten użytkownik jest już zblacklistowany.',
                allowedMentions: {
                    repliedUser: false
                }
            });
            let guildMembers = await message.guild.members.fetch();

            if(message.guild.members.fetch(target)) {
                const reason = `BLACKLIST > ${message.member.user.tag}`;
                target.ban({reason:reason}).catch(e => {
                    if(e) return message.reply({
                        content: `\`\`\`${e}\`\`\``,
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                }).then(() => {
                    // //logchannel
                    // var cnl = require('../../data/channels.json');
                    // var logs = message.guild.channels.cache.get(cnl.logschannel);
                        
                    // //logembed
                    // const logembed = new MessageEmbed()
                    //     .setAuthor(`${message.member.user.tag}`, `${message.member.user.avatarURL({dynamic: true})}`)
                    //     .setTimestamp()
                    //     .setColor('GRAY')
                    //     .setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** blacklist`)
                    //     .setFooter(`Case: #${casenumber}`)
                        
                    // logs.send({embeds: [logembed]})
                });
            }
            hellup.push(target.id)
            return message.reply({
                content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie zblacklistowano **${target.user.tag}**`,
                allowedMentions: {
                    repliedUser: false
                }
            });
        } else if(cmd === 'remove'){
            if(!hellup.includes(target.member.id)) return message.reply({
                content: 'Ten użytkownik nie jest zblacklistowany.',
                allowedMentions: {
                    repliedUser: false
                }
            });            
        }
    }
}

//add, remove dokonczyc