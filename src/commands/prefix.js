/**
 * prefix command
 */
const fs = require('fs');
const config = require('../../data/config.json');
module.exports = {
    name: 'prefix',
    permission: 'MANAGE_GUILD',
    execute(message, args) {
        //vars
        const newPrefix = args[0];
        const olfPrefix = config.prefix;

        //logging
        const log4js = require('log4js');
        const commandLogger = log4js.getLogger('commands');
        //commandLogger.info(`${command.name.toUpperCase()} :: ${message.member.user.tag}`)
        
        //code
        if(!message.member.permissions.has(module.exports.permission)) return message.reply({
            content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``,
            allowedMentions: {
                repliedUser: false
            }
        });
        if(!args[0]) return message.reply({
            content: 'Podaj nowy prefix!',
            allowedMentions: {
                repliedUser: false
            }
        });

        config.prefix = newPrefix;
        fs.writeFile('./data/config.json', JSON.stringify(config, null, 2), function writeJSON(err) {
            if (err) return message.reply({
                content: `\`\`\`${err}\`\`\``,
                allowedMentions: {
                    repliedUser: false
                }
            });
        });

        message.reply({
            content: `:white_check_mark: Zmieniono prefix z **${olfPrefix}** na **${newPrefix}**`,
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}