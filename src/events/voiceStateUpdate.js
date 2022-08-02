/**
 * voiceStateUpdate event
 */
const log4js = require('log4js');
module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState, client) {
        //database
        const config = require('../../data/config.json');
        const channelsIds = require('../../data/channels.json');


        //logs
        const privLog = log4js.getLogger('privVoice');


        //priv voice channels
        if(newState.channelId === channelsIds.privVoiceCreateChannel) {
            let memberExistingChannel = newState.guild.channels.cache.find(c => c.name === `PRIV | ${newState.member.user.username}`); //check if member channel already exists
            if(memberExistingChannel) return newState.member.voice.setChannel(memberExistingChannel); //if member channel exists (memberExistingChannel) move member to this channel


            newState.guild.channels.create(`PRIV | ${newState.member.user.username}`, { //create new channel
                type: 'GUILD_VOICE', //channel type
                parent: channelsIds.privVoiceCategory //channel category
            }).then(cnl => {
                newState.member.voice.setChannel(cnl); //move member to created channel 
                
                cnl.permissionOverwrites.create(newState.member, { //creating channel permission overwrite
                    VIEW_CHANNEL: true
                });
                var userPrivVoiceDatabase = require(`../../data/privVoice.json`); //reading priv voice database
                try {
                    userPrivVoiceDatabase[newState.member.user.id].forEach(newCnlMemberId => { //making loop to add all members included in databse
                        const memberToAdd = newState.member.guild.members.cache.get(newCnlMemberId) //getting member from guild.members using their ID
                        cnl.permissionOverwrites.edit(memberToAdd, { //creating channel permisison overwrite
                            VIEW_CHANNEL: true
                        });
                    })                    
                } catch(e) {
                    //nothing 
                }

            });
            privLog.warn(`Created Priv Voice for ${newState.member.user.tag}`);
            return
        };

        //priv voice channel deleting
        if(oldState.channel && oldState.channel.name.startsWith('PRIV |')) { if(oldState.channel.members.size === 0) return oldState.channel.delete().then(deleted => {
            privLog.warn(`Deleted Priv Voice "${deleted.name}"`);
        })}; //checking&deleting channel if empty
        
    }
};