const warnDatabase = require('../../data/warns.json');
const { sendLogs, newCasenumber, noPingReply } = require('../../utils');
const { PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
module.exports = {
  name: 'removewarn',
  usage: 'removewarn <@użytkownik> [ID warna]',
  permission: PermissionFlagsBits.KickMembers,
  aliases: ['delwarn', 'rwarn'],
  async execute(message, args) {
    //vars
    const target = message.mentions.members.first();
    const id = args.slice(1).join(' ');

    //logging
    const log4js = require('log4js');
    const commandLogger = log4js.getLogger('commands');
    const userLogger = log4js.getLogger('users');
    const consoleLog = log4js.getLogger('console');

    //code
    if(!message.member.permissions.has(module.exports.permission)) return noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`KickMembers\``});
    if(!target) return noPingReply({message: message, content: `Podaj prawidłowego użytkownika!`});
    if(target.id == message.member.id) return noPingReply({message: message, content: `Nie możesz sam sobie usunąć warna!`});
    if(target.roles.highest.position >= message.member.roles.highest.position) return noPingReply({message: message, content: `Nie możesz usunąć warna temu użytkownikowi!`});
    if(!warnDatabase[target.id] || JSON.stringify(warnDatabase[target.id]) == '{}') return noPingReply({message: message, content: `Użytkownik nie ma żadnych ostrzeżeń!`});

    const { casenumber } = require('../../data/data.json');

  
    function sendLogsAndUpdateCasenumber() {
      userLogger.info(`REMOVEWARN: ${target.user.tag} - ${target.id} | warnId: ${id || 'all'} | moderator: ${message.member.user.tag}`);
      consoleLog.info(`REMOVEWARN: ${target.user.tag} - ${target.id} | warnId: ${id || 'all'} | moderator: ${message.member.user.tag}`);
      sendLogs({
        type: 'removewarn',
        message: message,
        target: target, 
        id: id ? id : 'wszystkie',
        casenumber: casenumber
      });
      newCasenumber();
    };

    function saveDatabase(warnDatabase) {
      fs.writeFile('./data/warns.json', JSON.stringify(warnDatabase, null, 2), function writeJSON(err) {
        if(err) console.error(err);
      });
    };
    
    if(id) {
      if(!warnDatabase[target.id][id]) return noPingReply({message: message, content: `Nie znaleziono podanego warna!`});

      delete warnDatabase[target.id][id];
      saveDatabase(warnDatabase);

      noPingReply({
        message: message,
        content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie usunięto warna **${target.user.tag}** (ID: **${id}**)`
      });
      sendLogsAndUpdateCasenumber();
      return
    } else {
      delete warnDatabase[target.id];
      saveDatabase(warnDatabase);

      noPingReply({
        message: message,
        content: `:white_check_mark: \`Case: #${casenumber}\` Pomyślnie usunieto wszystkie warny **${target.user.tag}**`
      });
      sendLogsAndUpdateCasenumber();
      return
    };
  }
}