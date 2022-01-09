/**
 * messageCreate event
 */
const config = require('../../data/config.json');
module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        //code

        //autoreactions
        //start
        //vars
        const cnl = require('../../data/channels.json');

        let upvote = '779116005284642857';
        let downvote = '779116034794979359';
        let plusjeden = '837260568351997993';
        let munusjeden = '837260568855183380';
        let cringe = '837262159926263808';
        let kekw = '837262841375490087';

        //memy
        if(message.channel.id === cnl.memychannel) {
            if(message.attachments.size > 0 || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('#mem')) {
                message.react(upvote)
                message.react(downvote)
                message.react(cringe)
                message.react(kekw)
            };
        //pokaz swoje jedzonko
        } else if(message.channel.id === cnl.pokazswojejedzonkochannel) {
            if (message.attachments.size > 0 || message.content.includes('https://') || message.content.includes('https://')){
                message.react(upvote)
                message.react(downvote)
            };
        } else if(message.channel.id === cnl.memynsfwchannel) {
            if(message.attachments.size > 0 || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('#mem')) {
                message.react(upvote)
                message.react(downvote)
                message.react(cringe)
                message.react(kekw)
            };
        };
        //end


        //command handling
        //start
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);

        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply({
                content: `\`\`\`${error}\`\`\``,
                allowedMentions: {
                    repliedUser: false
                }
            });
        }
        //end
    }
}
