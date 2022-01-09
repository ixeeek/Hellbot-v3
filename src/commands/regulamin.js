/**
 * regulamin command
 */
const {MessageEmbed} = require('discord.js');
module.exports = {
    name: 'regulamin',
    execute(message, args) {
        if(!message.author.id === "443657012769849366" || !message.author.id === "476122334747557904") return;

        const command = args[0];

        /**
         * channels:
         * 
         * memy: <#761695458598453278>
         * nsfw: <#782895576986681396>
         * memy-nsfw: <#904848187033018448>
         * nsfw-hard: <#829658785052098570>
         * boty: <#777257807635283968>
         * skargi: <#760579614761680897>
         * brak-mikro: <#868680564046168074>
         */
        if(command === 'ogolny') {
            const regulaminEmbed = new MessageEmbed()
                .setTitle('Regulamin serwera')
                .addFields(
                    {name:'§1 Postanowienia ogólne', value:'§1.1 Zdanie administracji dotyczące kar i ograniczeń jest bezsporne.\n§1.2 Na serwerze obowiązuje Polskie Prawo.\n§1.3 Na serwerze obowiązuje bezwzględny zakaz reklamowania się, bez względu na sposób reklamowania.\n§1.4 Nazwa użytkownika, avatar, banner oraz custom status nie mogą zawierać treści wulgarnych/erotycznych/rasistowskich.\n§1.4.1 Nazwa użytkownika nie może zawierać znaków ascii, nazwy takie będą zmieniane przez administracji na dowolny tekst.\n§1.5 Administracja ma prawo do zmiany regulaminu bez informowania o tym użytkowników, lecz przypadki złamania regulaminu przed jego aktualizacją, będą sądzone zgodnie z ówczesną wersją regulaminu.'},
                    {name:'§2.0 Regulamin kanałów tekstowych ', value:'§2.1 Poszczególne kanały tekstowy mają swoje regulaminy, dostępne w wiadomości poniżej, jeżeli dany kanał nie jest wyszczególniony w poniższym regulaminie, obowiązują tam zasady z ogólnego regulaminu.\n§2.2 Na kanałach tekstowych obowiązuje kultura osobista, szacunek do innych użytkowników oraz podstawowa ortografia.\n§2.3 Na kanałach tekstowych obowiązuje zakaz poruszania treści religijnych, politycznych, rasistowskich itp.\n§2.4 Na wszystkich kanałach obowiązuje zakaz wysyłania treści NSFW (18+), wyjątkami są kanały posiadające w nazwie „nsfw”.\n§2.5 Na kanałach tekstowych obowiązuje zakaz wysyłania plików wykonawczych, oraz zamieszczania skróconych linków.'},
                    {name:'§3.0 Regulamin kanałów głosowych', value:'§3.1 Na kanałach głosowych obowiązuje kultura osobista oraz szacunek do innych użytkowników.\n§3.2 Na kanałach głosowych niedozwolone jest robienie tzw. errapów.\n§3.3 Od muzyki na kanałach głosowych, są boty muzyczne, w związku z czym niedozwolone jest puszczanie muzyki do mikrofonu.\n§3.4 Podczas transmisji na żywo, lub podczas posiadania włączonej kamerki, obowiązuje zakaz pokazywania treści wulgarnych/erotycznych.\n§3.5 Zakazuję się tzw. "skakania po kanałach".'},
                    {name:'§4.0 Postanowienia końcowe', value:'§4.1 Korzystanie z serwera, wiąże się z zaakceptowaniem powyższego regulaminu, jak i regulaminów poszczególnych kanałów.\n§4.2 Nieznajomość powyższego regulaminu, nie zwalnia z przestrzegania go.\n§4.3 Administracja zastrzega sobie pełne prawo do ukarania użytkownika w sytuacjach nieprzewidzianych w regulaminie, takie ukaranie musi być wystarczająco uargumentowane.\n§4.4 Nieprzestrzeganie powyższego regulaminu wiąże się z otrzymaniem kary, kara jest wybierana przez administratora indywidualnie do każdej sytuacji.'}
                )
                .setColor('00FF00')
                .setFooter('Zakazuje się kopiowania powyższego regulaminu bez pisemnej zgody administratora.\nOstatnia zmiana regulaminu: 16.11.2021 r.')
            
            message.delete()
            message.channel.send({embeds: [regulaminEmbed]})            
        } else if(command === 'kanaly') {
            const regulaminEmbed = new MessageEmbed()
                .setTitle('Regulaminy kanałów')
                .setColor('RED')
                .addFields(
                    {name:'§1 Kanał \'nsfw\' i \'nsfw-hard\'', value:'§1.1 Na obydwu kanałach obowiązuje bezwzględny zakaz wysyłania rzeczy niezgodnych z prawem oraz ToS\'em Discorda.\n§1.2 Kanał <#782895576986681396> przeznaczony jest tylko na zwykłe porno, do innych rzeczy nsfw przeznaczony jest kanał <#829658785052098570>.\n§1.3 Do używania komendy `porn <rodzaj>` w Hellbocie, przeznaczony jest kanał <#782895576986681396>. Zakazuje się jednak nadużywania (spamowania) tej komendy.'},
                    {name:'§2 Kanał \'memy\' i \'memy-nsfw\'', value:'§2.1 Na ww. kanałach administracja prosi o (w miarę możliwości) niekomentowanie memów, od tego są reakcje. Ewentualnie łamanie regulaminu, prosimy zgłaszać na kanale <#760579614761680897>, lub w prywatnej wiadomości do administratora.\n§2.2 Kanał <#761695458598453278> jest przeznaczony do zwykłych memów, te z przekleństwami, lub kontrowersyjną treścią, prosimy oznaczać jako SPOILER. Kanał <#904848187033018448>, przeznaczony jest na memy zawierające kontent nsfw lub mocno kontrowersyjny.'},
                    {name:'§3 Inne kanały', value: '§3.1 Do używania botów przeznaczony jest kanał <#777257807635283968>, nadużywanie botów na kanałach innych niż <#777257807635283968> (i <#782895576986681396> do komendy `porn`), będzie karane mutem na 24h.\n§3.2 Nadmierne wysyłanie bezpodstawnych skarg na kanale <#760579614761680897>, będzie wiązało się z otrzymaniem muta na 3 dni.\n§3.3 Kanał <#868680564046168074> przeznaczony jest do "rozmów" na kanałach głosowych, bez mikrofonu.'}
                )
                .setFooter('Użytkownik może zostać ukarany, w sytuacjach nieprzewidzianych w powyższym regulaminie, jeżeli administator uzna to za rażące przewinienie.\nZakazuje się kopiowania powyższego regulaminu bez pisemnej zgody administratora.\nOstatnia zmiana regulaminu: 16.11.2021 r.')

            message.delete()
            message.channel.send({embeds: [regulaminEmbed]})
        } 
    }
}