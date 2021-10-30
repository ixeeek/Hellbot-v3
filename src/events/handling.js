/**
 * messageCreate event
 * 
 * event only with commands handling
 */
const config = require('../../data/config.json');
module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        //Music bot queue
        // const queue = new Map();
        // const serverQueue = queue.get(message.guild.id);

        if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        
        const commandName = args.shift().toLowerCase();
        
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
        if (!command) return;
    
        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply(`\`\`\`${error}\`\`\``);
        }
    }
}