/**
 * ready event
 */
const cron = require('cron');
const moment = require('moment');
const config = require('../../data/config.json');
const channels = require('../../data/channels.json');
module.exports = {
    name: 'ready',
    execute(client) {
        //date channel changing
        let zmianiadaty = new cron.CronJob('00 01 00 * * *', () => {
            const guild = client.guilds.cache.find(g => g.id === config.guildId);
        
            const datax = moment().format('DD/MM/YYYY')
        
            guild.channels.cache.get(channels.datachannel).edit({
                name: `🕒︱Data: ${datax}`
            });
            console.log('Updated \'DATA\' channel!')
        })
        zmianiadaty.start();
        console.log('Job: \'zmianadaty\' started');
        
        //every hour bot activity changing
        let statusrefresh = new cron.CronJob('0 0 * * * *', () => {
            client.user.setActivity(`discord.hellup.pl | v${config.version}`, {type: 2})
        })
        statusrefresh.start();
        console.log('Job: \'statusrefresh\' started');

        //bot status
        client.user.setActivity(`discord.hellup.pl | v${config.version}`, {type: 2})
        //login info
        console.log(' _    _ ______ _      _      ____   ____ _______ \n| |  | |  ____| |    | |    |  _ \\ / __ \\__   __|\n| |__| | |__  | |    | |    | |_) | |  | | | |   \n|  __  |  __| | |    | |    |  _ <| |  | | | |   \n| |  | | |____| |____| |____| |_) | |__| | | |   \n|_|  |_|______|______|______|____/ \\____/  |_|   ');
        console.log(`${client.user.tag} - ${client.user.id}`);
        console.log('All modules loaded successfully!');

        //data channel update
        const guild = client.guilds.cache.find(g => g.id === config.guildId);
        const datax = moment().format('DD/MM/YYYY')
        guild.channels.cache.get(channels.datachannel).edit({
            name: `🕒︱Data: ${datax}`
        })
        console.log('Updated \'DATA\' channel!')
    }
}
