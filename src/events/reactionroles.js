/**
 * messageReaction add event
 * 
 * event only for reaction roles
 */
// module.exports = {
//     name: 'messageReactionAdd',
//     async execute(reaction, user) {
//         //code
//         if(reaction.partial) {
//             try {
//                 await reaction.fetch();
//             } catch(error) {
//                 console.log(error);
//             }
//         }
//         let message = reaction.message, emoji = reaction.emoji;
//     }
// }