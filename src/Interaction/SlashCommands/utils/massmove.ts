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
    Client,
    EmbedBuilder,
    PermissionsBitField,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    ChannelType,
    ApplicationCommandType,
    BaseGuildVoiceChannel,
    VoiceChannel
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import logger from '../../../core/logger.js';

export const command: Command = {
    name: 'massmove',

    description: 'Move all members connected in a voice channel to another one',
    description_localizations: {
        "fr": "Déplacer tous les membres connectés dans un canal vocal vers un autre"
    },

    options: [
        {
            name: 'from',
            type: ApplicationCommandOptionType.Channel,

            channel_types: [ChannelType.GuildVoice],

            description: 'The voice channel to move members from',
            description_localizations: {
                "fr": "Le canal vocal d'où déplacer les membres"
            },

            required: true,
        },
        {
            name: 'to',
            type: ApplicationCommandOptionType.Channel,

            channel_types: [ChannelType.GuildVoice],

            description: 'The voice channel to move members to',
            description_localizations: {
                "fr": "Le canal vocal où déplacer les membres"
            },

            required: true,
        },
    ],
    thinking: true,
    category: 'utils',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        let data = await client.functions.getLanguageData(interaction.guildId) as LanguageData;

        const fromChannel = interaction.options.getChannel('from')! as BaseGuildVoiceChannel;
        const toChannel = interaction.options.getChannel('to')! as BaseGuildVoiceChannel;

        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.MoveMembers)) {
            await interaction.editReply({ content: "You don't have Move Members permission" });
            return;
        }

        let movedCount = 0;
        let errorCount = 0;

        for (const member of (fromChannel as BaseGuildVoiceChannel).members.values()) {
            try {
                await member.voice.setChannel((toChannel as VoiceChannel));
                movedCount++;
            } catch (error) {
                errorCount++;
            }
        }

        let embed = new EmbedBuilder()
            .setFooter({ text: 'iHorizon', iconURL: "attachment://icon.png" })
            .setColor('#007fff')
            .setTimestamp()
            .setThumbnail(interaction.guild?.iconURL() as string)
            .setDescription(data.massmove_results
                .replace('${interaction.user}', interaction.user.toString())
                .replace('${movedCount}', movedCount.toString())
                .replace('${errorCount}', errorCount.toString())
                .replace('${fromChannel}', fromChannel.toString())
                .replace('${toChannel}', toChannel.toString())
            );

        await interaction.editReply({
            embeds: [embed],
            files: [{ attachment: await interaction.client.functions.image64(interaction.client.user?.displayAvatarURL()), name: 'icon.png' }]
        });
    },
};