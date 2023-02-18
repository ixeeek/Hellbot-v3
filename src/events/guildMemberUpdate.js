const { AuditLogEvent } = require('discord.js');
const data = require('../../data/data.json');
module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember) {
		if(oldMember.roles.cache.size > newMember.roles.cache.size) {
			const guildMutedRole = newMember.guild.roles.cache.find(r => r.id == data.roles.muted);

			const fetchedLogs = await oldMember.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberRoleUpdate,
			});
			const roleAddLog = fetchedLogs.entries.first();
			if(!roleAddLog) return;
			const { executor, target } = roleAddLog;
			if(oldMember.roles.cache.has(guildMutedRole.id) && !newMember.roles.cache.has(guildMutedRole.id)) {
				const muteDatabase = require('../../data/mutes.json');

				if(executor.bot) return;
				if(!muteDatabase[target.id]) return;
				rsn = `${executor.username}#${executor.discriminator} próbował usunąć role zmutowanego użytkownika!`;
				newMember.roles.add(guildMutedRole, rsn)

				executor.send('Dlaczego usuwasz role "muted" zmutowanemu użytkownikowi? Zawsze pozostaje komenda .unmute <użytownik>').catch(e => {if(e) console.log('blocked bot? disabled dms?')})
			}
		}
	}
}