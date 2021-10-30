/**
 * porn command
 */
const discordnsfw = require('discord-nsfw');

module.exports = {
    name: 'porn',
    aliases: ['p'],
    async execute(message, args){
        //vars
        const type = args.slice(0).join(' ');
        const nsfw = new discordnsfw();
        const list = ["anal", " 4k", " ass", " gonewild", " porngif", " pussy", " thigh", " boobs", " hentai ass", " hentai", " hentai thigh", " hentai midriff", " erokemo", " kitsune", " lewd", " neko feet", " neko pussy", " neko tits", " solo"];

        //code
        if(!message.channel.nsfw) return message.reply('Tej komendy możesz użyć tylko na kanale NSFW!');
        if(!type) return message.reply(`Nie znaleziono! Użyj: \`${list}\``);   
        

        if(type === "anal") {
            img = await nsfw.anal();
        } else if(type === "4k") {
            img = await nsfw.fourk();
        } else if(type === "ass") {
            img = await nsfw.ass();
        } else if(type === "gonewild") {
            img = await nsfw.gonewild();
        } else if(type === "porngif") {
            img = await nsfw.pgif();
        } else if(type === "pussy") {
            img = await nsfw.pussy();
        } else if(type === "thigh") {
            img = await nsfw.thigh();
        } else if(type === "boobs") {
            img = await nsfw.boobs();
        } else if(type === "hentai ass") {
            img = await nsfw.hentaiass();
        } else if(type === "hentai") {
            img = await nsfw.hentai();
        } else if(type === "hentai midriff") {
            img = await nsfw.hmidriff();
        } else if(type === "hentai thigh") {
            img = await nsfw.hentaithigh();
        } else if(type === "erokemo") {
            img = await nsfw.erokemo();
        } else if(type === "kitsune") {
            img = await nsfw.kitsune();
        } else if(type === "lewd") {
            img = await nsfw.lewd();
        } else if(type === "neko feet") {
            img = await nsfw.nekofeet();
        } else if(type === "neko pussy") {
            img = await nsfw.nekopussy();
        } else if(type === "neko tits") {
            img = await nsfw.nekotits();
        } else if(type === "solo") {
            img = await nsfw.solo();
        } else {
            return message.reply(`Nie znaleziono! Użyj: \`${list}\``)
        }

        message.delete()
        message.channel.send(img)
    }
}