/**
 * priv channels management command
 */
const log4js = require('log4js');
const fs = require('node:fs');
module.exports = {
    name: 'priv',
    usage: 'priv <komenda> [argunemt]',
    async execute(message, args) {
        const cmd = args[0]; //first message arg as command
        let cmdList = ["add", "remove", "addtemp"]   
        if(!cmd) return message.reply({ //repliug user if command is not privided
            content: `Podaj komende!\nLista komend: \`${cmdList.join(', ')}\``,
            allowedMentions: {
                repliedUser: false
            }
        });

        //logs
        const privLog = log4js.getLogger('privVoice');


        let memberPrivChannel = message.guild.channels.cache.find(c => c.name === `PRIV | ${message.member.user.username}`); //get member priv channel
        if(!memberPrivChannel || memberPrivChannel === undefined) {
            privLog.info(`${message.member.user.tag} tried to use command without private channel`)
            return message.reply({ //repliug user if member dosent have priv channel
                content: `Nie posiadasz prywatnego kanału głosowego!`,
                allowedMentions: {
                    repliedUser: false
                }
            });
        };


        //COMMANDS
        const privOwner = message.member.user.id;
        var userPrivVoiceDatabase = require(`../../data/privVoice.json`);
        switch(cmd) {
            case "add":
                const memberToAdd = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
                if(!memberToAdd) return message.reply({ //repling if memberToAdd isnt specified
                    content: `Podaj użytkownika, którego chcesz dodać do prywatnego kanału!`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                if(memberToAdd.id === message.member.id) return message.reply({ //checking if memberToAdd and message member ID's are the same
                    content: `To twój kanał, jesteś już do niego dodany :)`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });       
                if(memberPrivChannel.permissionsFor(memberToAdd).has('VIEW_CHANNEL')) return message.reply({ //repling command if member is already added to channel
                    content: `Ten użytkownik jest już dodany do prywatnego kanału!`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });

                memberPrivChannel.permissionOverwrites.edit(memberToAdd, { //creating channel permission overwrite
                    VIEW_CHANNEL: true
                });
                privLog.info(`${message.member.user.tag} added ${memberToAdd.user.tag} to their private channel (${memberPrivChannel.name})`) //logging adding member to priv channel


                //adding member to priv voice channel database
                try { //if member has already priv voice channel array just add member to it
                    userPrivVoiceDatabase[privOwner].push(memberToAdd.id);
                } catch(error) { //if not
                    userPrivVoiceDatabase[privOwner] = []; //create array
                    userPrivVoiceDatabase[privOwner].push(memberToAdd.id); //and then add member to it
                };
                
                fs.writeFile(`./data/privVoice.json`, JSON.stringify(userPrivVoiceDatabase, null, 2), function writeJSON(err) { //writing database
                    if (err) return console.log(err);
                });


                return message.reply({ //repliug on command success
                    content: `:white_check_mark:  Dodano **${memberToAdd.user.tag}** do prywatnego kanału`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            case "addtemp":
                const memberToTempAdd = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
                if(!memberToTempAdd) return message.reply({ //repling if memberToAdd isnt specified
                    content: `Podaj użytkownika, którego chcesz dodać do prywatnego kanału!`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                if(memberToTempAdd.id === message.member.id) return message.reply({ //checking if memberToAdd and message member ID's are the same
                    content: `To twój kanał, jesteś już do niego dodany :)`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });       
                if(memberPrivChannel.permissionsFor(memberToTempAdd).has('VIEW_CHANNEL')) return message.reply({ //repling command if member is already added to channel
                    content: `Ten użytkownik jest już dodany do prywatnego kanału!`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });

                memberPrivChannel.permissionOverwrites.edit(memberToTempAdd, { //creating channel permission overwrite
                    VIEW_CHANNEL: true
                });
                privLog.info(`${message.member.user.tag} added temporary ${memberToAdd.user.tag} to their private channel (${memberPrivChannel.name})`) //logging adding member to priv channel

               
                return message.reply({ //repliug on command success
                    content: `:white_check_mark:  Dodano tymczasowo **${memberToAdd.user.tag}** do prywatnego kanału`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });

            case "remove":
                const memberToRemove = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
                if(!memberToRemove) return message.reply({ //repling if memberToRemove isnt specified
                    content: `Podaj użytkownika, którego chcesz usunąć z prywatnego kanału!`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                if(memberToRemove.id === message.member.id) return message.reply({ //checking if memberToRemove and message member ID's are the same
                    content: `To twój kanał, nie możesz się z niego usunąc...`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                if(!memberPrivChannel.permissionsFor(memberToRemove).has('VIEW_CHANNEL')) return message.reply({ //repling command if member is already added to channel
                    content: `Tego użytkownika nie ma dodanego do prywatnego kanału.`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                
                //removing member from voice channel databse
                var userPrivVoiceDatabase = require(`../../data/privVoice.json`); //getting priv voice database

                const itemToDeleteIndex = userPrivVoiceDatabase[privOwner].indexOf(memberToRemove); //getting index of user to delete position in array
                userPrivVoiceDatabase[privOwner].splice(itemToDeleteIndex, 1); //deleting member from array using index from above function

                fs.writeFile(`./data/privVoice.json`, JSON.stringify(userPrivVoiceDatabase, null, 2), function writeJSON(err) { //writing database
                    if (err) return console.log(err);
                });


                memberPrivChannel.permissionOverwrites.delete(memberToRemove, { //creating channel permission overwrite
                    VIEW_CHANNEL: true
                });
                privLog.info(`${message.member.user.tag} removed ${memberToRemove.user.tag} from their private channel (${memberPrivChannel.name})`) //logging removing member from priv channel


                //kicking member from channel
                var channelMembers = []; //defining array to store voice members
                memberPrivChannel.members.forEach(cnlMember => { //getting all voice channel members to array
                    channelMembers.push(cnlMember.id)
                });
                if(channelMembers.includes(memberToRemove.id)) memberToRemove.voice.disconnect(); //if member is in channel, kick

                return message.reply({ //repliug on command success
                    content: `:white_check_mark:  Usunięto **${memberToRemove.user.tag}** z prywatnego kanału`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });


            default:
                return message.reply({ //repliug user if provided command is wrogn
                    content: `Niepoprawna komenda!\nLista komend: \`${cmdList.join(', ')}\``,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
        }
    }
};