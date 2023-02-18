const fs = require('fs');
const { PermissionFlagsBits } = require('discord.js');
const { noPingReply } = require('../../utils');
module.exports = {
	name: 'badword',
	permissions: PermissionFlagsBits.Administrator,
	async execute(message, args) {
		//vars
		const cmd = args[0];
		const badWord = args[1];
		const cmds = ["list", "add", "remove"];

		//database
		const badWordsDb = require('../../data/data.json');
		const badWordsList = badWordsDb.badWords.join('`; `');

		if(!cmd) return noPingReply({message: message, content: `Lista komend: \`list\`, \`add\`, \`remove\``});
		if(!cmds.includes(cmd)) return noPingReply({message: message, content: 'Podaj prawidłową komende: `list`, `add`, `remove`'});

		switch (cmd) {
			case 'list':
				if(badWordsList.length < 0 || !badWordsList) return noPingReply({message: message, content: `Prawdopodbnie wystąpił problem z bazą danych, to nie jest tak, że nie mamy zabronionych słów ~ ixek`});

				message.member.send({
					content: `Lista zabronionych słow:\n\`${badWordsList}\``,
				}).catch(e => {
					if(e) return noPingReply({message: message, content: `Lista zabronionych słow:\n\`${badWordsList}\``});
				});
				break;
			case 'add':
				if(!message.member.permissions.has(module.exports.permissions)) return noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`Administrator\``});
				if(!badWord) return noPingReply({message: message, content: `required arg(s): badWord`});
				if(badWordsList.includes(badWord)) return noPingReply({message: message, content: `To słowo jest już zabronione!`});

				badWordsDb.badWords.push(badWord);
				fs.writeFile('./data/maindata.json', JSON.stringify(badWordsDb, null, 2), function writeJSON(err) {
					if (err) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``});
				});

				const updatedBadWordsList = require('../../data/data.json');
        
        noPingReply({message: message, content: `:white_check_mark: Dodano ${badWord} do list słów zabronionych. Aktualna lista: \`${updatedBadWordsList.badWords.join('`; `')}\``});
				break;
			case 'remove':
				if(!message.member.permissions.has(module.exports.permissions)) return noPingReply({message: message, content: `Nie masz permisji do użycia tej komendy! Wymagane permisje: \`Administrator\``});
				if(!badWord) return noPingReply({message: message, content: `required arg(s): badWord`});
				if(!badWordsList.includes(badWord)) return noPingReply({message: message, content: `To słowo nie jest zabronione!`});

				const itemToDeleteIndex = badWordsDb.badWords.indexOf(badWord); //getting index of user to delete position in array
				badWordsDb.badWords.splice(itemToDeleteIndex, 1); //deleting item from array using index from above function

				fs.writeFile('./data/data.json', JSON.stringify(badWordsDb, null, 2), function writeJSON(err) {
					if (err) return noPingReply({message: message, content: `\`\`\`${err}\`\`\``});
				});

				const REMupdatedBadWordsList = require('../../data/data.json');
        noPingReply({message: message, content: `:white_check_mark: Usunięto ${badWord} z listy słów zabronionych. Aktualna lista: \`${REMupdatedBadWordsList.badWords.join('`; `')}\``});
				break;
		};
	}
}