/**
 * porn command
 */
const discordnsfw = require('discord-nsfw');

module.exports = {
    name: 'porn',
    async execute(message, args){
        //vars
        const type = args.slice(0).join(' ');
        const nsfw = new discordnsfw();
        const list = ["anal", " 4k", " ass", " gonewild", " porngif", " pussy", " thigh", " boobs", " hentai ass", " hentai", " hentai thigh", " hentai midriff", " erokemo", " kitsune", " lewd", " neko feet", " neko pussy", " neko tits", " solo"];
        //logging
        const log4js = require('log4js');
        const commandLogger = log4js.getLogger('commands');
        //commandLogger.info(`${command.name.toUpperCase()} :: ${message.member.user.tag}`)
        
        //code
        if(!message.channel.nsfw) return message.reply({
            content: 'Tej komendy możesz użyć tylko na kanale NSFW!',
            allowedMentions: {
                repliedUser: false
            }
        });
        if(!type) return message.reply({
            content: `Nie znaleziono! Użyj: \`${list}\``,
            allowedMentions: {
                repliedUser: false
            }
        });
        
        switch(type) {
            case "anal":
                img = await nsfw.anal();
                break;
            case "4k":
                img = await nsfw.fourk();
                break;
            case "ass":
                img = await nsfw.ass();
                break;
            case "gonewild":
                img = await nsfw.gonewild();
                break;
            case "porngif":
                img = await nsfw.pgif();
                break;
            case "pussy":
                img = await nsfw.pussy();
                break;
            case "thigh":
                img = await nsfw.thigh();
                break;
            case "boobs":
                img = await nsfw.boobs();
                break;
            case "hentai ass":
                img = await nsfw.hentaiass();
                break;
            case "hentai":
                img = await nsfw.hentai();
                break;
            case "hentai midriff":
                img = await nsfw.hmidriff();
                break;
            case "hentai thigh":
                img = await nsfw.hentaithigh();
                break;
            case "erokemo":
                img = await nsfw.erokemo();
                break;
            case "kitsune":
                img = await nsfw.kitsune();
                break;
            case "lewd":
                img = await nsfw.lewd();
                break;
            case "neko feet":
                img = await nsfw.nekofeet();
                break;
            case "neko pussy":
                img = await nsfw.nekopussy();
                break;
            case "neko tits":
                img = await nsfw.nekotits();
                break;
            case "solo":
                img = await nsfw.solo();
                break;
            default:
                message.reply({
                    content: `Nie znaleziono! Użyj: \`${list}\``,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
                break;
        };

        message.reply({
            files: [img],
            allowedMentions: {
                repliedUser: false
            }
        })
    }
}