/**
 * clear command
 */
module.exports = {
    name: 'clear',
    usage: 'clear <ilość>',
    permission: 'MANAGE_MESSAGES',
    execute(message, args) {
        //vars
        const amount = parseInt(args[0]);

        //code
        if(!message.member.permissions.has(module.exports.permission)) return message.reply({
            content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permission}\``,
            allowedMentions: {
                repliedUser: false
            }
        });
        
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