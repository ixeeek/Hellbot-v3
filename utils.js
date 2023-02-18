//reply to message with message.reply without ping to member who used command (replied member)
function noPingReply({message, content, embed}) {
  if(content) {
      message.reply({
        content: content,
        allowedMentions: {
        repliedUser: false
      }
    });
  } else if(embed) {
    message.reply({
      embeds: [embed],
      allowedMentions: {
        repliedUser: false
      }
    });
  } else if(content && embed) {
    message.reply({
      content: content,
      embeds: [embed],
      allowedMentions: {
        repliedUser: false
      }
    });
  } else {
    return;
  };
};


//send logs
function sendLogs({type, message, target, reason, time, id, until, muteDatabase, guild, casenumber}) {
  logEmbedColors = {
    "ban": "Red",
    "unban": "DarkRed",
    "mute": "Blue",
    "unmute": "DarkBlue",
    "autounmute": "DarkBlue",
    "warn": "Gold",
    "removewarn": "DarkGold",
    "kick": "Aqua",
    "nuke": "Green"
  };

  if(!Object.keys(logEmbedColors).includes(type)) return;

  const { EmbedBuilder } = require('discord.js');
  const logEmbed = new EmbedBuilder()
    .setAuthor(type == 'autounmute' ? {name: 'Automatyczny unmute po upływie czasu'} : {name: message.member.user.tag, iconURL: message.member.user.avatarURL({dynamic: true})})
    .setTimestamp()
    .setColor(logEmbedColors[type])
    .setFooter({text: `Case: #${casenumber}`})

  switch(type) {
    case 'ban':
      logEmbed.setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** ban\n**Powód:** ${reason}`) ;
      break
    case 'kick':
      logEmbed.setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** kick\n**Powód:** ${reason}`)
      break
    case 'mute':
      logEmbed.setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** mute\n**Powód:** ${reason}\n**Czas muta:** ${time}\n**Unmute:** ${until}`)
      break
    case 'nuke':
      logEmbed.setDescription(`**Kanał:** #${message.channel.name} (${message.channel.id})\n**Akcja:** nuke`)
      break
    case 'removewarn':
      logEmbed.setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** removewarn\n**ID Warna:** ${id}`)
      break
    case 'unban':
      logEmbed.setDescription(`**Użytkownik:** ${target.tag} (${target.id})\n**Akcja:** unban`)
      break
    case 'unmute':
      logEmbed.setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** unmute\n**Powód mute\'a**: ${muteDatabase[target.id].reason}\n**Zmutowany przez:** ${muteDatabase[target.id].moderator}`)
      break
    case 'autounmute':
      logEmbed.setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** unmute\n**Powód mute\'a**: ${muteDatabase[target.id].reason}\n**Zmutowany przez:** ${muteDatabase[target.id].moderator}`)
      break
    case 'warn':
      logEmbed.setDescription(`**Użytkownik:** ${target.user.tag} (${target.id})\n**Akcja:** warn\n**Powód:** ${reason}\n**ID Warna:** ${id}`)
      break
    default:
      break
  };

  var { channels } = require('./data/data.json');
  var logsChannel = type == 'autounmute' ? guild.channels.cache.get(channels.logschannel) : message.guild.channels.cache.get(channels.logschannel);

  return logsChannel.send({
    embeds: [logEmbed]
  });
};


//newCasenumber
function newCasenumber() {
  const fs = require('node:fs');
  var dataFile = require('./data/data.json');

  dataFile.casenumber += 1;
  fs.writeFile('./data/data.json', JSON.stringify(dataFile, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
  });
};


module.exports = { noPingReply, sendLogs, newCasenumber };



//log utils file load
const log4js = require('log4js');
const startLogger = log4js.getLogger('start');
const consoleLog = log4js.getLogger('console');
consoleLog.info(`Loaded: utils.js;`);
startLogger.info(`Loaded: utils.js;`);