/**
 * clear command
 */
module.exports = {
    name: 'clear',
    usage: 'clear <ilość>',
    permission: 'MANAGE_MESSAGES',
    async execute(message, args) {
        //vars
        const amount = parseInt(args[0]);

        //logging
        const log4js = require('log4js');
        const commandLogger = log4js.getLogger('commands');
        //commandLogger.info(`${command.name.toUpperCase()} :: ${message.member.user.tag}`)

        //code
        if(!message.member.permissions.has(module.exports.permission)) {
            const wait = require('node:timers/promises').setTimeout;
            message.reply({
            content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``,
            allowedMentions: {
                repliedUser: false
            }});
            await wait(10);
            return commandLogger.warn(`${module.exports.name.toUpperCase()} | ${message.member.user.tag} was denied to use command (noPermission)`)
        }; 
        
        if(!amount) return message.reply({
            content: 'Podaj liczbe wiadomości!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(isNaN(amount)) return message.reply({
            content: 'Podaj prawidłową liczbe!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(amount > 100 || amount < 1) return message.reply({
            content: 'Wartość musi być w zakresie 1-100',
            allowedMentions: {
                repliedUser: false
            }
        });

        if(amount === 100) {
            message.channel.bulkDelete(amount, true).then(n => {
                message.channel.send(`:white_check_mark: Pomyślnie usunięto \`${n.size}\` wiadomości!`).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(() => {return})
                    }, 10000)
                })
                console.log(`Usunieto ${n.size} wiadomosci z ${message.channel.name}`);
            })
            return
        } else {
            message.channel.bulkDelete(amount+1, true).then(n => {
                message.channel.send(`:white_check_mark: Pomyślnie usunięto \`${n.size-1}\` wiadomości!`).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(() => {return})
                    }, 10000)
                })
                console.log(`Usunieto ${n.size} wiadomosci z ${message.channel.name}`);                
            })
            return
        }
    }
}