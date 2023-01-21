
require('dotenv').config();
import { REST, Routes } from 'discord.js';
const commands = [
    {
        name:"hey",
        description :"say hey "
    },
    {
        name:"by ",
        description :"say by "
    },
];

const rest= new REST ({version: '10'}).setToken(process.env.TOKEN);
(async ()=>{
             try{
                   console.log('registration slash command ...');
                   await rest .put(
                                     Routes.applicationGuildCommands( process.env.CLIENT_ID, process.env.GUILD_ID),
                                     { body : commands}
                                     );
                    console.log('Slash command were registraction successfully');
                } catch(error){
                    console.log(`there was an error : ${error}`);
                }
            }
            

)();
import { Client, IntentsBitField } from 'discord.js';
const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages, // acceder aux messages "il faut  activer  l'option dans discord bot
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.MessageReactions,
    ]
})
client.on("ready",(_c)=>{
    console.log("bot connected while " + client.user.tag);
    client.user.setPresence({
        activities: [{
            name:"connected"

        }],
        status:"dnd"
    })
})

const commande ="!!"
// repond aux message
client.on("creat a message", (message)=>{
    console.log(message)
    if(message.content.startsWith(commande)){
        const input = message.content.slice(commande.length).trim().split("")
        const command = input.shift();
        switch(command){
            case "aide":
                message.channel.send("comment je peux vous aidez")
                .then(()=>{
                    message.delete()
                })
                .catch(console.log)
                break;
                default:
                    message.reply("command doesn't exist")
        }
    }
});

//repond aux reaction 
client.on("messagereactionsadd", async(reaction, _user)=>{
    console.log(reaction.user)
})

module.exports = {
    name: 'ticket',
    aliases: [],
    permissions: [],
    description: 'open a ticket!',
    async execute(message, _args, _cmd, _client, _discord) {
      const channel = await message.guild.channels.create(
        `ticket: ${message.author.tag}`,
      );
  
      channel.setParent('932184344011898890'); // application id  
  
      channel.permissionOverwrites.edit(message.guild.id, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
      });
      channel.permissionOverwrites.edit(message.author, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
      });
  
      const reactionMessage = await channel.send(
        'Thank you for contacting support!',
      );
  
      try {
        await reactionMessage.react('🔒');
        await reactionMessage.react('⛔');
      } catch (err) {
        channel.send('Error sending emojis!');
        throw err;
      }
  
      const filter = (_reaction, user) =>
        message.guild.members.cache
          .find((member) => member.id === user.id)
          .permissions.has('ADMINISTRATOR');
  
      const collector = reactionMessage.createReactionCollector({
        dispose: true,
        filter,
      });
  
      collector.on('collect', (reaction, _user) => {
        switch (reaction.emoji.name) {
          case '🔒':
            channel.permissionOverwrites.edit(message.author, { SEND_MESSAGES: false });
            break;
          case '⛔':
            channel.send('Deleting this channel in 5 seconds!');
            setTimeout(() => channel.delete(), 5000);
            break;
        }
      });
  
      message.channel
        .send(`We will be right with you! ${channel}`)
        .then((msg) => {
          setTimeout(() => msg.delete(), 7000);
          setTimeout(() => message.delete(), 3000);
        })
        .catch((err) => {
          throw err;
        });
    },
  };
client.login(TOKEN)
  
 
