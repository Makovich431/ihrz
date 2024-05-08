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
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    GuildVoiceChannelResolvable,
    Message,
    PermissionsBitField,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';

export const command: Command = {

    name: 'invites-leaderboard',

    description: 'Show the guild invites\'s leaderboard!',
    description_localizations: {
        "fr": "Afficher le classement des invitations du serveur"
    },

    thinking: false,
    category: 'invitemanager',
    type: "PREFIX_IHORIZON_COMMAND",
    run: async (client: Client, interaction: Message, args: string[]) => {
        let data = await client.functions.getLanguageData(interaction.guildId) as LanguageData;

        var text: string = data.leaderboard_default_text;
        let char = await client.db.get(`${interaction.guildId}.USER`);
        let tableau: Array<any> = [];
        let i: number = 1;

        for (let i in char) {
            let a = char?.[i]?.INVITES;
            if (a?.invites >= 1) {
                tableau.push({
                    invCount: a.invites,
                    text: data.leaderboard_text_inline
                        .replace(/\${i}/g, i)
                        .replace(/\${a\.invites\s*\|\|\s*0}/g, a.invites || 0)
                        .replace(/\${a\.regular\s*\|\|\s*0}/g, a.regular || 0)
                        .replace(/\${a\.bonus\s*\|\|\s*0}/g, a.bonus || 0)
                        .replace(/\${a\.leaves\s*\|\|\s*0}/g, a.leaves || 0)
                });
            };
        };

        tableau.sort((a: { invCount: number; }, b: { invCount: number; }) => b.invCount - a.invCount);

        tableau.forEach((index: { text: string; }) => {
            text += `Top #${i} - ${index.text}`;
            i++;
        });

        let embed = new EmbedBuilder()
            .setColor("#FFB6C1")
            .setDescription(text)
            .setTimestamp()
            .setFooter({ text: client.user?.username!, iconURL: "attachment://icon.png" })
            .setThumbnail(interaction.guild?.iconURL() as string);

        await interaction.reply({
            embeds: [embed],
            files: [{ attachment: await client.functions.image64(client.user?.displayAvatarURL()), name: 'icon.png' }]
        });
        return;
    },
};