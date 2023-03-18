const { 
  Client, 
  Intents, 
  Collection, 
  EmbedBuilder,
  Permissions, 
  ApplicationCommandType, 
  PermissionsBitField, 
  ApplicationCommandOptionType 
} = require('discord.js');
module.exports = {
  name: 'help',
  description: 'show help panel',
  run: async (client, interaction) => {

    const embed = new EmbedBuilder()
    .setColor('#e1a95f')
    .setDescription("Thanks you to use iHorizon !\nContact creator: `PeacefulTrees`.\nThis is a list of commands you can use.")
    .addFields(
      {name: "Moderation", value: "`/ban`, `/kick`, `/clear`, `/lock`, `/unlock`, `/avatar`, `/lockall`,\n `/unban`, `/tempmute`, `/unmute`", inline: true},
      {name: "Ranks", value: "`/xp`, `/setxpchannels`, `/disablexp`", inline: true},
      {name: "Fun", value: "`/caracteres`, `/cats`, `/hack`, `/hug`, `/kiss`, `/morse`, `/poll`, `/question`, `/slap`", inline: true},
      {name: "Utils", value: "`/serverinfo`, `/userinfo`, `/snipe`, `/renew`", inline: true},
      {name: "Giveaway", value: "`/start`, `/end`, `/reroll`", inline: true},
      {name: "Bot", value: "`/status`, `/ping`, `/botinfo`, `/invite`", inline: true},
      {name: "Music", value: "`/p`, `/loop`, `/nowplaying`, `/pause`, `/resume`, `/skip`, `/stop`, `/queue`, `/shuffle`", inline: true},
      {name: "Backup", value: "`/backup`", inline: true},
      {name: 'Guilds Config', value: '`/setchannels`, `/setjoinmessage`, `/setleavemessage`, `/setjoinroles`, `/setjoindm`, `/setup`, `/blockpub`, `/guildprofil`', inline: true},
      {name: "Profils Customizations", value: "`/setprofildescriptions`, `/profil`, `/setprofilage`", inline: true},
      {name: "Economy", value: "`/add-money`, `/balance`, `/daily`, `/monthly`, `/pay`, `/remove-money`, `/rob`, `/weekly`, `/work`", inline: true},
      {name: "Owner", value: "`/owner`, `/unowner`, `/blacklist`, `/unblacklist`", inline: true},
      {name: "Role Reactions", value: "`/reactionroles`", inline: true},
      {name: "Invite Manager", value: "`/removeinvites`, `/invites`,`/addinvites`, `/leaderboard`", inline: true},
      {name: "Ticket [RENEW]", value: "`/add`, `/close`, `/delete`, `/sethereticket`, `/open`, `/remove`, `/transript`, `/disableticket`", inline: true},
      {name: "MemberCount [NEW]", value: "`/setmembercount`", inline: true},
      {name: "🔞 || Nsfw || 🔞", value: "||/nsfw||, ||nothing to see here||", inline: true},
      )
      .setFooter({ text: 'iHorizon', iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})
      .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 }))
      .setTimestamp();
      
      return interaction.reply({ embeds: [embed] });
    
    const filter = (interaction) => interaction.user.id === interaction.member.id;
    }}