const { MessageEmbed } = require("discord.js")

/**
 * help command
 */
module.exports = {
    name: 'help',
    execute(message, args) {
        const embed = new MessageEmbed()
            .setTitle('Pomoc Hellbot\'a')
            .setColor(message.guild.me.displayHexColor)
            .addFields(
                {name:'Ogólne komendy:', value:'`userinfo [@użytkownik/id]` - wyświetla podstawowe informacje o użytkowniku\n`warnings [@użytkownik/id]` - wyświetla ostrzeżenia podanego użytkownika'},
                {name:'Komendy NSFW', value:'`porn <rodzaj>` - wyświetla obrazek/film NSFW zgodnie z podanym rodzajem'},
                {name:'Komendy Musicbota', value:'`play <link do piosenki/playlist>` - dodaje piosenke do kolejki\n`skip` - skipuje piosenke (wymaga specjalnej roli)\n`queue` - wyświetla aktualną kolejke piosenek\n`remove <pozycja/all>` - usuwa podaną piosenke (lub wszytkie) z kolejki (wymaga specjalnej roli)\n`loop` - zmienia tryb loopa: off/piosenka/kolejka (wymaga specjalnej roli)\n`disconnect` - wychodzi z kanału (wymaga specjalnej roli, bot sam wyjdzie jak kanał zostanie pusty)'}
            )
            .setFooter('Kod źródłowy: https://github.com/ixeeek/Hellbot-v3')

        message.channel.send({embeds:[embed]})
    }
}