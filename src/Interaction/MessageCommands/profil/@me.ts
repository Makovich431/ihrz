/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2024 iHorizon
*/

import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    GuildVoiceChannelResolvable,
    Message,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';

export const command: Command = {

    name: "me",

    description: "See the iHorizon's profil of the member!",
    description_localizations: {
        "fr": "Voir le profil iHorizon du membre"
    },

    thinking: true,
    category: 'profil',
    type: "PREFIX_IHORIZON_COMMAND",
    run: async (client: Client, interaction: Message, args: string[]) => {

        let data = await client.functions.getLanguageData(interaction.guildId) as LanguageData;
        let member = interaction.mentions.users?.toJSON()[1] || interaction.author;
        let table = client.db.table('USER_PROFIL')

        var description = await table.get(`${member.id}.desc`);
        if (!description) description = data.profil_not_description_set;

        var level = await client.db.get(`${interaction.guildId}.USER.${member.id}.XP_LEVELING.level`);
        if (!level) level = 0;

        var balance = await client.db.get(`${interaction.guildId}.USER.${member.id}.ECONOMY.money`);
        if (!balance) balance = 0;

        var age = await table.get(`${member.id}.age`);
        if (!age) age = data.profil_unknown;

        var gender = await table.get(`${member.id}.gender`);
        if (!gender) gender = data.profil_unknown;

        let profil = new EmbedBuilder()
            .setTitle(data.profil_embed_title
                .replace(/\${member\.tag}/g, member.globalName || member.username)
                .replace('${client.iHorizon_Emojis.icon.Pin}', client.iHorizon_Emojis.icon.Pin)
            )
            .setDescription(`\`${description}\``)
            .addFields(
                { name: data.profil_embed_fields_nickname, value: member.globalName || member.username, inline: false },
                { name: data.profil_embed_fields_money, value: balance + data.profil_embed_fields_money_value, inline: false },
                { name: data.profil_embed_fields_xplevels, value: level + data.profil_embed_fields_xplevels_value, inline: false },
                { name: data.profil_embed_fields_age, value: age + data.profil_embed_fields_age_value, inline: false },
                { name: data.profil_embed_fields_gender, value: `${gender}`, inline: false })
            .setColor("#ffa550")
            .setThumbnail(member.displayAvatarURL({ extension: 'png', size: 512 }))
            .setTimestamp()
            .setFooter({ text: 'iHorizon', iconURL: "attachment://icon.png" })

        await interaction.reply({
            embeds: [profil],
            files: [{ attachment: await client.functions.image64(client.user?.displayAvatarURL()), name: 'icon.png' }]
        });
        return;
    },
};