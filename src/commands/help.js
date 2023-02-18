const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'help',
	execute(message, args) {
		const embed = new EmbedBuilder()
			.setTitle('Pomoc Hellbot\'a')
			.setColor(message.guild.members.me.displayHexColor)
			.addFields(
				{name:'Ogólne komendy:', value:'`userinfo [@użytkownik/id]` - wyświetla podstawowe informacje o użytkowniku\n`warnings [@użytkownik/id]` - wyświetla ostrzeżenia podanego użytkownika\n`botinfo` - pokazuje informacje o bocie\n`badword list` - wysyła liste zabronionych słów'},
				{name:'Komendy NSFW', value:'`porn <rodzaj>` - wyświetla obrazek/film NSFW zgodnie z podanym rodzajem'},
				{name:'Komendy Musicbota', value:'`play <link do piosenki/playlist>` - dodaje piosenke do kolejki\n`skip` - skipuje piosenke (wymaga specjalnej roli)\n`queue` - wyświetla aktualną kolejke piosenek\n`remove <pozycja/all>` - usuwa podaną piosenke (lub wszytkie) z kolejki (wymaga specjalnej roli)\n`loop` - zmienia tryb loopa: off/piosenka/kolejka (wymaga specjalnej roli)\n`disconnect` - wychodzi z kanału (wymaga specjalnej roli, bot sam wyjdzie jak kanał zostanie pusty)'},
				{name:'Komendy Prywatnych Kanałów Głosowych', value:'`priv add <@użytkownik/id>` - dodaje użytkownika do kanału prywatnego\n`priv remove <@użytkownik/id>` - usuwa użytkownika z kanału prywatnego\n`priv addtemp <@użytkowik/id>` - dodaje tymczasowo użytkownika do kanału\n**Dodanie użytkownika do kanału prywatnego, powoduje zapisanie to w bazie danych, celem łatwiejszego użycia bota. Po utworzeniu nowego kanału (czyt. po usunięciu poprzedniego, kiedy będzie pusty), bot automatycznie doda wszystkie poprzednio dodane osoby.**'}
			)
			.setFooter({text: 'Kod źródłowy: https://github.com/ixeeek/Hellbot-v3'})

		message.channel.send({embeds:[embed]});
	}
}