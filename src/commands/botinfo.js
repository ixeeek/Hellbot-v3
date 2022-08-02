const Discord = require('discord.js');
const process = require('process');
//botInfo
module.exports = {
    name: 'botInfo',
    aliases: ['bot', 'client', 'botinfo'],
    execute(message, args, client) {
        //uptime convertin
        var processUpTime = process.uptime()
        function convertHMSD(seconds) {
            seconds = Number(seconds);
            var d = Math.floor(seconds / (3600*24));
            var h = Math.floor(seconds % (3600*24) / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            var s = Math.floor(seconds % 60);

            var dDisplay = d > 0 ? d + (d == 1 ? "d, " : "d, ") : "";
            var hDisplay = h > 0 ? h + (h == 1 ? "h, " : "h, ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? "m, " : "m, ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
            return dDisplay + hDisplay + mDisplay + sDisplay;
        };

        //embed
        const infoEmbed = new Discord.MessageEmbed()
            .setTitle('Informacje o bocie')
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp()
            .setDescription(`**Developer:** ixek#1234\n**Source kod:** https://github.com/ixeeek/Hellbot-v3\n**Uptime**: ${convertHMSD(processUpTime)}`)
        
        
        return message.reply({
            embeds: [infoEmbed],
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}