const { EmbedBuilder, version } = require('discord.js');
const process = require('process');
const os = require('os');
const { noPingReply } = require('../../utils');
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
		const infoEmbed = new EmbedBuilder()
			.setAuthor({name: `Informacje o bocie`, iconURL: client.user.displayAvatarURL()})
			.setColor(message.guild.members.me.displayHexColor)
			.addFields(
				{name: 'Developerzy', value: `<@443657012769849366>, <@310518471815462913>`, inline: false},				
				
				{name: 'Uptime', value: `${convertHMSD(process.uptime())}`, inline: true},
				{name: 'Ping do DiscordAPI', value: `${client.ws.ping}ms`, inline: true},
				{name: 'Ping Bota', value: `${Math.round((Date.now() - message.createdTimestamp) / 100)}ms`, inline: true},                

				{name: 'Wersja Discord.js', value: `v${version}`, inline: true},
				{name: 'Wersja Node.js', value: `${process.version}`, inline: true},
				{name: 'System', value: `${os.type()} v${os.release()}`, inline: true},
			)
		.setTimestamp()
		
		return noPingReply({message: message, embed: infoEmbed});
	}
}