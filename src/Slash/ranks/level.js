/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2023 iHorizon
*/

const slashInfo = require(`${process.cwd()}/files/ihorizon-api/slashHandler`);

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

const fs = require("fs")
const { QuickDB } = require("quick.db");
const db = new QuickDB();

slashInfo.ranks.level.run = async (client, interaction) => {
  let sus = interaction.options.getMember("user")
  if (!sus) {
    var user = interaction.user
    var level = await db.get(`${interaction.guild.id}.USER.${user.id}.XP_LEVELING.level`) || 0;
    var currentxp = await db.get(`${interaction.guild.id}.USER.${user.id}.XP_LEVELING.xp`) || 0;
    var xpNeeded = level * 500 + 500
    var expNeededForLevelUp = xpNeeded - currentxp
    let nivEmbed = new EmbedBuilder()
      .setTitle("__**XP Level**__: \`" + user.username + "\`")
      .setColor('#0014a8')
      .addFields({ name: ":arrow_up:・__Levels:__", value: "`" + `${currentxp}/${xpNeeded}` + "\`", inline: true },
        { name: ":money_with_wings:・__Experience:__", value: "`" + level + "\`", inline: true })
      .setDescription(`\`${expNeededForLevelUp}\` **experience points needed for the next level!**`)
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/847484098070970388/850684283655946240/discord-icon-new-2021-logo-09772BF096-seeklogo.com.png")
      .setFooter({ text: 'iHorizon', iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) })

    interaction.reply({ embeds: [nivEmbed] })
  } else {
    var level = await db.get(`${interaction.guild.id}.USER.${sus.user.id}.XP_LEVELING.level`) || 0;
    var currentxp = await db.get(`${interaction.guild.id}.USER.${sus.user.id}.XP_LEVELING.xp`) || 0;
    var xpNeeded = level * 500 + 500
    var expNeededForLevelUp = xpNeeded - currentxp
    let nivEmbed = new EmbedBuilder()
      .setTitle("__**XP Level**__: \`" + sus.user.username + "\`")
      .setColor('#0014a8')
      .addFields({ name: ":arrow_up:・__Levels:__", value: "`" + `${currentxp}/${xpNeeded}` + "\`", inline: true },
        { name: ":money_with_wings:・__Experience:__", value: "`" + level + "\`", inline: true })
      .setDescription(`\`${expNeededForLevelUp}\` **experience points needed for the next level!**`)
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/847484098070970388/850684283655946240/discord-icon-new-2021-logo-09772BF096-seeklogo.com.png")
      .setFooter({ text: 'iHorizon', iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) })

    interaction.reply({ embeds: [nivEmbed] })
  }
  return;
};

module.exports = slashInfo.ranks.level;