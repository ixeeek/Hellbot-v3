const cron = require('cron');
const moment = require('moment');
const data = require('../../data/data.json');
const log4js = require('log4js');
const fs = require('node:fs');
const { sendLogs } = require('../../utils');
module.exports = {
	name: 'ready',
	execute(client) {
		const startLogger = log4js.getLogger('start');
		const consoleLog = log4js.getLogger('console');
		const userLogger = log4js.getLogger('users');
		//date channel changing
		let zmianiadaty = new cron.CronJob('00 01 00 * * *', () => {
			const guild = client.guilds.cache.find(g => g.id === data.config.guildId);
			const dataFormated = moment().format('DD/MM/YYYY')

			guild.channels.cache.get(data.channels.datachannel).edit({
				name: `🕒︱Data: ${dataFormated}`
			});
		});
		zmianiadaty.start();
		consoleLog.info('Job: \'zmianadaty\' started');
		startLogger.info('Job: \'zmianadaty\' started');
    

    //bot activity with update every hour
    function setActivity() {
      var activityMessage = `dc.hellup.pl | v${data.config.version}`;
      var activityType = 2; //1 - playing, 2 - listening, 3 - watching

      return client.user.setActivity(activityMessage, {type: activityType});
    };
    setActivity();
		let statusrefresh = new cron.CronJob('0 0 * * * *', () => {
      setActivity();
    });
		statusrefresh.start();
		consoleLog.info('Job: \'statusrefresh\' started');
		startLogger.info('Job: \'statusrefresh\' started');
		

		//login info
		console.log(' _    _ ______ _      _      ____   ____ _______ \n| |  | |  ____| |    | |    |  _ \\ / __ \\__   __|\n| |__| | |__  | |    | |    | |_) | |  | | | |   \n|  __  |  __| | |    | |    |  _ <| |  | | | |   \n| |  | | |____| |____| |____| |_) | |__| | | |   \n|_|  |_|______|______|______|____/ \\____/  |_|   ');
		consoleLog.info(`${client.user.tag} - ${client.user.id}`);
		consoleLog.info(`All modules loaded successfully! Version: v${data.config.version}`);
		startLogger.info(`${client.user.tag} - ${client.user.id}`);
		startLogger.info(`All modules loaded successfully! Version: v${data.config.version}`);


		//data channel update
		const guild = client.guilds.cache.find(g => g.id === data.config.guildId);
		const datax = moment().format('DD/MM/YYYY')
		guild.channels.cache.get(data.channels.datachannel).edit({
			name: `🕒︱Data: ${datax}`
		})
		consoleLog.info('Updated \'DATA\' channel!')


		//mute check
		const muteDatabase = require('../../data/mutes.json');
		setInterval(async () => {
			for(let user in muteDatabase) {
				if(Date.now() > muteDatabase[user].time) {
					let memberGuild = client.guilds.cache.get(data.config.guildId);
					let guildMutedRole = memberGuild.roles.cache.find(r => r.id == data.roles.muted);

          new Promise((resolve, reject) => { //create promise
            memberGuild.members.fetch(user).then(mutedMember => { //get member object from guild
						userLogger.info(`AUTO UNMUTE: ${mutedMember.user.tag} - ${mutedMember.user.id} | MUTE REASON: ${muteDatabase[mutedMember.id].reason} | MUTED BY: ${muteDatabase[mutedMember.id].moderator}`); //log
						consoleLog.info(`AUTO UNMUTE: ${mutedMember.user.tag} - ${mutedMember.user.id} | MUTE REASON: ${muteDatabase[mutedMember.id].reason} | MUTED BY: ${muteDatabase[mutedMember.id].moderator}`); //log

						rsn = 'Czas mute\'a upłynął!';
						mutedMember.roles.remove(guildMutedRole, rsn); //remove member role

						sendLogs({
              type: 'autounmute',
							target: mutedMember,
							muteDatabase: muteDatabase,
              guild: memberGuild,
							casenumber: muteDatabase[mutedMember.id].casenumber
						}); //send logs 
            resolve(); //resolve promise (if promise is not resolved, "then" method wouldnt work)
          });
					}).then(async () => { //then (if promise is resolved)
					  delete muteDatabase[user]; //delete database object
					  fs.writeFile('./data/mutes.json', JSON.stringify(muteDatabase, null, 2), function writeJSON(err) {
					  	if(err) console.log(err);
					  }); //save database
          });
				}
			};
		}, 10000);
	}
}