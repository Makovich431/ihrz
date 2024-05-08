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
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    BaseGuildTextChannel,
    ButtonBuilder,
    ButtonStyle,
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

    name: 'prevnames',

    description: 'Lookup an Discord User, and see this previous username !',
    description_localizations: {
        "fr": "Recherchez un utilisateur Discord et voyez ces noms d'utilisateur précédent"
    },

    thinking: true,
    category: 'utils',
    type: "PREFIX_IHORIZON_COMMAND",
    run: async (client: Client, interaction: Message, args: string[]) => {

        let data = await client.functions.getLanguageData(interaction.guildId) as LanguageData;
        let user = interaction.mentions.users.toJSON()[1] || interaction.author;
        let table = client.db.table("PREVNAMES");

        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        //     await interaction.reply({ content: data.prevnames_not_admin });
        //     return;
        // };
        
        var char: Array<string> = await table.get(`${user.id}`) || [];

        if (char.length == 0) {
            await interaction.reply({ content: `${data.prevnames_undetected}` });
            return;
        };

        let currentPage = 0;
        let usersPerPage = 5;
        let pages: { title: string; description: string; }[] = [];

        for (let i = 0; i < char.length; i += usersPerPage) {
            let pageUsers = char.slice(i, i + usersPerPage);
            let pageContent = pageUsers.map((userId) => userId).join('\n');
            pages.push({
                title: `${data.prevnames_embed_title.replace("${user.username}", user.globalName || user.username)} | Page ${i / usersPerPage + 1}`,
                description: pageContent,
            });
        };

        let createEmbed = () => {
            return new EmbedBuilder()
                .setColor("#000000")
                .setTitle(pages[currentPage].title)
                .setDescription(pages[currentPage].description)
                .setFooter({ text: `iHorizon | Page ${currentPage + 1}/${pages.length}`, iconURL: "attachment://icon.png" })
                .setTimestamp()
        };

        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previousPage')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nextPage')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Secondary),
        );

        let messageEmbed = await interaction.reply({
            embeds: [createEmbed()],
            components: [(row as ActionRowBuilder<ButtonBuilder>)],
            files: [{ attachment: await client.functions.image64(client.user?.displayAvatarURL()), name: 'icon.png' }]
        });

        let collector = messageEmbed.createMessageComponentCollector({
            filter: (i) => {
                i.deferUpdate();
                return interaction.author.id === i.user.id;
            }, time: 60000
        });

        collector.on('collect', (interaction: { customId: string; }) => {
            if (interaction.customId === 'previousPage') {
                currentPage = (currentPage - 1 + pages.length) % pages.length;
            } else if (interaction.customId === 'nextPage') {
                currentPage = (currentPage + 1) % pages.length;
            }

            messageEmbed.edit({ embeds: [createEmbed()] });
        });

        collector.on('end', () => {
            row.components.forEach((component) => {
                if (component instanceof ButtonBuilder) {
                    component.setDisabled(true);
                }
            });
            messageEmbed.edit({ components: [(row as ActionRowBuilder<ButtonBuilder>)] });
        });

        return;
    },
};