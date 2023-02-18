let { config, buttonRoles } = require('../../data/data.json');
module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if(!interaction.isButton()) return;
		if(interaction.user.bot) return;
		if(!interaction.guild.id === config.guildId) return;

		
		//button roles
		if(interaction.customId.startsWith('roleButton')) {
			function addOrRemoveRole({buttonId, interaction}) {
				let selectedRole = interaction.guild.roles.cache.find(r => r.id == buttonRoles[buttonId]);


				/**
				 * custom checks
				 */
				//gender roles
				if(selectedRole.id == buttonRoles.roleButtonChlopak & interaction.member.roles.cache.has(buttonRoles.roleButtonDziewczyna)) {
					return interaction.reply({ephemeral: true, content: `Nie możesz mieć roli <@&${selectedRole.id}> i <@&${buttonRoles.roleButtonDziewczyna}> naraz.`});
				} else if(selectedRole.id == buttonRoles.roleButtonDziewczyna & interaction.member.roles.cache.has(buttonRoles.roleButtonChlopak)) {
					return interaction.reply({ephemeral: true, content: `Nie możesz mieć roli <@&${selectedRole.id}> i <@&${buttonRoles.roleButtonChlopak}> naraz.`});
				};
				//age roles
				let ageRoles = [buttonRoles['roleButton12-'], buttonRoles['roleButton12+'], buttonRoles['roleButton14+'], buttonRoles['roleButton16+'], buttonRoles['roleButton18+']];
				if(ageRoles.includes(selectedRole.id.toString())) {
					memberRoles = [];
					interaction.member.roles.cache.forEach(role => { 
						memberRoles.push(role.id);
					});

					let buttonRoleIndex = ageRoles.indexOf(selectedRole.id.toString());
					ageRoles.splice(buttonRoleIndex, 1);

					if(ageRoles.some(item => memberRoles.includes(item))) return interaction.reply({ephemeral: true, content: 'Nie możesz mieć dwóch roli wiekowych jednocześnie! Aby usunąć obecną role, klinij ponownie na nią.'})
				};


				//add role
				if(interaction.member.roles.cache.has(selectedRole.id)) {
					interaction.member.roles.remove(selectedRole.id, 'REACTION ROLES');
					interaction.reply({ephemeral: true, content: `Usunięto role <@&${selectedRole.id}>`});
					return
				};

				interaction.member.roles.add(selectedRole.id, 'REACTION ROLES');
				interaction.reply({ephemeral: true, content: `Dodano role <@&${selectedRole.id}>`});
			};

			addOrRemoveRole({buttonId: interaction.customId, interaction: interaction});
		}
	}
}