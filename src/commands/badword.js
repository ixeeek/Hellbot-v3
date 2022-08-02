/**
 * badword command
 */
const fs = require('fs');
module.exports = {
    name: 'badword',
    permissions: 'ADMINISTRATOR',
    async execute(message, args) {
        const {MessageEmbed} = require('discord.js');
        //vars
        const cmd = args[0];
        const badWord = args[1];
        const cmds = ["list", "add", "remove"];

        //database
        const badWordsDb = require('../../data/maindata.json');
        const badWordsList = badWordsDb.badWords.join('`; `');

        if(!cmd) return message.reply({
            content: 'Lista komend: `list`, `add`, `remove`',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(!cmds.includes(cmd)) {
            return message.reply({
                content: 'Podaj prawidłową komende: `list`, `add`, `remove`',
                allowedMentions: {
                    repliedUser: false
                }
            });
        };
        switch (cmd) {
            case 'list':
                if(badWordsList.length < 0 || !badWordsList) return message.reply({
                    content: 'Prawdopodbnie wystąpił problem z bazą danych, to nie jest tak, że nie mamy zabronionych słów ~ ixek',
                    allowedMentions: {
                        repliedUser: false
                    }
                })

                message.member.send({
                    content: `Lista zabronionych słow:\n\`${badWordsList}\``,
                }).catch(e => {
                    if(e) return message.reply({
                        content: `Lista zabronionych słow:\n\`${badWordsList}\``,
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                });
                break;
            case 'add':
                if(!message.member.permissions.has(module.exports.permissions)) return message.reply({
                    content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permissions}\``,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                if(!badWord) return message.reply({
                    content: `required arg(s): badWord`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                if(badWordsList.includes(badWord)) return message.reply({
                    content: 'To słowo jest już zabronione',
                    allowedMentions: {
                        repliedUser: false
                    }
                })

                badWordsDb.badWords.push(badWord);
                fs.writeFile('./data/maindata.json', JSON.stringify(badWordsDb, null, 2), function writeJSON(err) {
                    if (err) return message.reply({
                        content: `\`\`\`${err}\`\`\``,
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                });

                const updatedBadWordsList = require('../../data/maindata.json');
                message.reply({
                    content: `:white_check_mark: Dodano ${badWord} do list słów zabronionych. Aktualna lista: \`${updatedBadWordsList.badWords.join('`; `')}\``,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                break;
            case 'remove':
                if(!message.member.permissions.has(module.exports.permissions)) return message.reply({
                    content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`${module.exports.permissions}\``,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                if(!badWord) return message.reply({
                    content: `required arg(s): badWord`,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                if(!badWordsList.includes(badWord)) return message.reply({
                    content: 'To słowo nie jest zabronione',
                    allowedMentions: {
                        repliedUser: false
                    }
                })

                const itemToDeleteIndex = badWordsDb.badWords.indexOf(badWord); //getting index of user to delete position in array
                badWordsDb.badWords.splice(itemToDeleteIndex, 1); //deleting member from array using index from above function

                fs.writeFile('./data/maindata.json', JSON.stringify(badWordsDb, null, 2), function writeJSON(err) {
                    if (err) return message.reply({
                        content: `\`\`\`${err}\`\`\``,
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                });

                const REMupdatedBadWordsList = require('../../data/maindata.json');
                message.reply({
                    content: `:white_check_mark: Usunięty ${badWord} z listy słów zabronionych. Aktualna lista: \`${REMupdatedBadWordsList.badWords.join('`; `')}\``,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                break;
        }
    }
}