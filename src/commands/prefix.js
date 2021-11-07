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
        //code
        if(!message.member.permissions.has(module.exports.permission)) return message.reply(`Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``);
        if(!args[0]) return message.reply('Podaj nowy prefix!');

        config.prefix = newPrefix;
        fs.writeFile('./data/config.json', JSON.stringify(config, null, 2), function writeJSON(err) {
            if (err) return message.reply(`\`\`\`${err}\`\`\``);
        });

        message.reply(`:white_check_mark: Zmieniono prefix z **${olfPrefix}** na **${newPrefix}**`);
    }
}