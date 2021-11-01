/**
 * interactionCreate event
 * 
 * event only for button roles
 */
const config = require('../../data/config.json');
module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        if(!interaction.isButton()) return;
        if(interaction.user.bot) return;
        if(!interaction.guild.id === config.guildId) return;
        //code
        const roles = require('../../data/roles.json');
        const target = interaction.member;

        //weryfikacja
        if(interaction.customId === 'weryfikacjaButton') {
            reason = 'WERYFIKACJA';
            let verifiedRole = interaction.guild.roles.cache.find(r => r.id === roles.weryfikacja);

            if(target.roles.cache.has(verifiedRole.id.toString())) interaction.reply({ephemeral:true, content:'Jeseś juz zweryfikowany :)'});
            target.roles.add(verifiedRole.id.toString(), reason)
            interaction.reply({ephemeral:true, content:'Zweryfikowano :)'})
        };
        
        //nsfw
        if(interaction.customId === 'nsfwButton') {
            reason = 'REACTION ROLES';
            let nsfwRole = interaction.guild.roles.cache.find(r => r.id === roles.nsfw);

            if(!target.roles.cache.has(nsfwRole.id.toString())) {
                target.roles.add(nsfwRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${nsfwRole.id.toString()}>`})
            } else {
                target.roles.remove(nsfwRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${nsfwRole.id.toString()}>`})
            };
        }

        //main
        let chlopakRole = interaction.guild.roles.cache.find(r => r.id === roles.chlopak);
        let dziewczynaRole = interaction.guild.roles.cache.find(r => r.id === roles.dziewczyna);
        let dwanascieplusRole = interaction.guild.roles.cache.find(r => r.id === roles.dwanascieplus);
        let czternascieplusRole = interaction.guild.roles.cache.find(r => r.id === roles.czternascieplus);
        let osiemnascieplusRole = interaction.guild.roles.cache.find(r => r.id === roles.osiemnascieplus);
        let dwadziesciapiecplusRole = interaction.guild.roles.cache.find(r => r.id === roles.dwadziesciapiecplus);
        let czterdziesciplusRole = interaction.guild.roles.cache.find(r => r.id === roles.czterdziesciplus);


        //start
        if(interaction.customId === 'mainButton1') {
            reason = 'REACTION ROLES';
            if(target.roles.cache.has(dziewczynaRole.id.toString())) return interaction.reply({ephemeral:true, content:`Nie możesz mieć roli <@&${chlopakRole.id.toString()}> i <@&${dziewczynaRole.id.toString()}> naraz.`});
            if(!target.roles.cache.has(chlopakRole.id.toString())) {
                target.roles.add(chlopakRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${chlopakRole.id.toString()}>`})
            } else {
                target.roles.remove(chlopakRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${chlopakRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButton2') {
            reason = 'REACTION ROLES';
            if(target.roles.cache.has(chlopakRole.id.toString())) return interaction.reply({ephemeral:true, content:`Nie możesz mieć roli <@&${chlopakRole.id.toString()}> i <@&${dziewczynaRole.id.toString()}> naraz.`});
            if(!target.roles.cache.has(dziewczynaRole.id.toString())) {
                target.roles.add(dziewczynaRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${dziewczynaRole.id.toString()}>`})
            } else {
                target.roles.remove(dziewczynaRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${dziewczynaRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButton3') {
            reason = 'REACTION ROLES';

            if(!target.roles.cache.has(dwanascieplusRole.id.toString())) {
                if(target.roles.cache.has(dwanascieplusRole.id.toString()) || target.roles.cache.has(czternascieplusRole.id.toString()) || target.roles.cache.has(osiemnascieplusRole.id.toString()) || target.roles.cache.has(dwadziesciapiecplusRole.id.toString()) || target.roles.cache.has(czterdziesciplusRole.id.toString())) return interaction.reply({ephemeral:true, content:'Nie możesz mieć wiecej niż I roli wiekowej.'});
            
                target.roles.add(dwanascieplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${dwanascieplusRole.id.toString()}>`})
            } else {
                target.roles.remove(dwanascieplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${dwanascieplusRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButton4') {
            reason = 'REACTION ROLES';

            if(!target.roles.cache.has(czternascieplusRole.id.toString())) {
                if(target.roles.cache.has(dwanascieplusRole.id.toString()) || target.roles.cache.has(czternascieplusRole.id.toString()) || target.roles.cache.has(osiemnascieplusRole.id.toString()) || target.roles.cache.has(dwadziesciapiecplusRole.id.toString()) || target.roles.cache.has(czterdziesciplusRole.id.toString())) return interaction.reply({ephemeral:true, content:'Nie możesz mieć wiecej niż I roli wiekowej.'});
            
                target.roles.add(czternascieplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${czternascieplusRole.id.toString()}>`})
            } else {
                target.roles.remove(czternascieplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${czternascieplusRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButton5') {
            reason = 'REACTION ROLES';       
            
            if(!target.roles.cache.has(osiemnascieplusRole.id.toString())) {
                if(target.roles.cache.has(dwanascieplusRole.id.toString()) || target.roles.cache.has(czternascieplusRole.id.toString()) || target.roles.cache.has(osiemnascieplusRole.id.toString()) || target.roles.cache.has(dwadziesciapiecplusRole.id.toString()) || target.roles.cache.has(czterdziesciplusRole.id.toString())) return interaction.reply({ephemeral:true, content:'Nie możesz mieć wiecej niż I roli wiekowej.'});
            
                target.roles.add(osiemnascieplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${osiemnascieplusRole.id.toString()}>`})
            } else {
                target.roles.remove(osiemnascieplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${osiemnascieplusRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButton6') {
            reason = 'REACTION ROLES';

            if(!target.roles.cache.has(dwadziesciapiecplusRole.id.toString())) {
                if(target.roles.cache.has(dwanascieplusRole.id.toString()) || target.roles.cache.has(czternascieplusRole.id.toString()) || target.roles.cache.has(osiemnascieplusRole.id.toString()) || target.roles.cache.has(dwadziesciapiecplusRole.id.toString()) || target.roles.cache.has(czterdziesciplusRole.id.toString())) return interaction.reply({ephemeral:true, content:'Nie możesz mieć wiecej niż I roli wiekowej.'});
            
                target.roles.add(dwadziesciapiecplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${dwadziesciapiecplusRole.id.toString()}>`})
            } else {
                target.roles.remove(dwadziesciapiecplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${dwadziesciapiecplusRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButton7') {
            reason = 'REACTION ROLES';   

            if(!target.roles.cache.has(czterdziesciplusRole.id.toString())) {
                if(target.roles.cache.has(dwanascieplusRole.id.toString()) || target.roles.cache.has(czternascieplusRole.id.toString()) || target.roles.cache.has(osiemnascieplusRole.id.toString()) || target.roles.cache.has(dwadziesciapiecplusRole.id.toString()) || target.roles.cache.has(czterdziesciplusRole.id.toString())) return interaction.reply({ephemeral:true, content:'Nie możesz mieć wiecej niż I roli wiekowej.'});
            
                target.roles.add(czterdziesciplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${czterdziesciplusRole.id.toString()}>`})
            } else {
                target.roles.remove(czterdziesciplusRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${czterdziesciplusRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButtonPc') {
            reason = 'REACTION ROLES';
            let pcRole = interaction.guild.roles.cache.find(r => r.id === roles.pc);
        
            if(!target.roles.cache.has(pcRole.id.toString())) {
                target.roles.add(pcRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${pcRole.id.toString()}>`})
            } else {
                target.roles.remove(pcRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${pcRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButtonTel') {
            reason = 'REACTION ROLES';
            let telRole = interaction.guild.roles.cache.find(r => r.id === roles.tel);
        
            if(!target.roles.cache.has(telRole.id.toString())) {
                target.roles.add(telRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${telRole.id.toString()}>`})
            } else {
                target.roles.remove(telRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${telRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButtonPs') {
            reason = 'REACTION ROLES';
            let psRole = interaction.guild.roles.cache.find(r => r.id === roles.ps);
        
            if(!target.roles.cache.has(psRole.id.toString())) {
                target.roles.add(psRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${psRole.id.toString()}>`})
            } else {
                target.roles.remove(psRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${psRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButtonXbox') {
            reason = 'REACTION ROLES';
            let xboxRole = interaction.guild.roles.cache.find(r => r.id === roles.xbox);
        
            if(!target.roles.cache.has(xboxRole.id.toString())) {
                target.roles.add(xboxRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${xboxRole.id.toString()}>`})
            } else {
                target.roles.remove(xboxRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${xboxRole.id.toString()}>`})
            };
        } else if(interaction.customId === 'mainButtonNintendo') {
            reason = 'REACTION ROLES';
            let nintendoRole = interaction.guild.roles.cache.find(r => r.id === roles.nintendo);

            if(!target.roles.cache.has(nintendoRole.id.toString())) {
                target.roles.add(nintendoRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Dodano role <@&${nintendoRole.id.toString()}>`})
            } else {
                target.roles.remove(nintendoRole.id.toString(), reason)
                interaction.reply({ephemeral:true, content:`Usunięto role <@&${nintendoRole.id.toString()}>`})
            };
        }
        //end
    }
}