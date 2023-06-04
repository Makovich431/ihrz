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

const { QuickDB } = require("quick.db");
const db = new QuickDB();
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
  name: 'work',
  description: 'Work and earn money into your bank',
  run: async (client, interaction) => {
    const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
    let data = await getLanguageData(interaction.guild.id);
    
    const talkedRecentlyforw = new Set();

    if (talkedRecentlyforw.has(interaction.user.id)) {
      return message.channel.send(data.work_cooldown_error);
    }

    let amount = Math.floor(Math.random() * 200) + 1;

    let embed = new EmbedBuilder()
      .setAuthor({ name: data.work_embed_author
        .replace(/\${interaction\.user\.username}/g, interaction.user.username)
        .replace(/\${interaction\.user\.discriminator}/g, interaction.user.discriminator)

        , iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` })
      .setDescription(data.work_embed_description
        .replace(/\${interaction\.user\.username}/g, interaction.user.username)
        .replace(/\${interaction\.user\.discriminator}/g, interaction.user.discriminator)
        .replace(/\${amount}/g, amount)
        )
      .setColor("#f1d488")

    interaction.reply({ embeds: [embed] })
    await db.add(`${interaction.guild.id}.USER.${interaction.user.id}.ECONOMY.money`, amount)

    talkedRecentlyforw.add(interaction.user.id);
    setTimeout(() => {
      talkedRecentlyforw.delete(interaction.user.id);
    }, 3600000);

    const filter = (interaction) => interaction.user.id === interaction.member.id;
  }
}
