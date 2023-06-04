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

const superagent = require('superagent');
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

const logger = require(`${process.cwd()}/src/core/logger`);

module.exports = {
  name: 'cats',
  description: 'cute cats',
  run: async (client, interaction) => {
    const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
    let data = await getLanguageData(interaction.guild.id);

    superagent
      .get('http://edgecats.net/random')
      .end((err, res) => {
        if (err) {
          logger.err(err);
          interaction.reply('Erreur lors de la récupération de l\'image du chat.');
          return;
        } else {
          const emb = new EmbedBuilder()
            .setImage(res.text)
            .setTitle(data.cats_embed_title)
            .setTimestamp();

          interaction.reply({ embeds: [emb] });
        }
      });

  }
}