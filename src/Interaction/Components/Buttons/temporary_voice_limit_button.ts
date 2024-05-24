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

import { ActionRowBuilder, ButtonInteraction, CacheType, ComponentType, EmbedBuilder, Guild, GuildMember, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { LanguageData } from '../../../../types/languageData';

export default async function (interaction: ButtonInteraction<CacheType>) {

    let result = await interaction.client.db.get(`${interaction.guildId}.VOICE_INTERFACE.interface`);
    let table = interaction.client.db.table('TEMP');

    let lang = await interaction.client.functions.getLanguageData(interaction.guildId) as LanguageData;
    let member = interaction.member as GuildMember;

    let targetedChannel = (interaction.member as GuildMember).voice.channel;

    let getChannelOwner = await table.get(`CUSTOM_VOICE.${interaction.guildId}.${interaction.user.id}`);

    if (!result) return await interaction.deferUpdate();
    if (result.channelId !== interaction.channelId
        || getChannelOwner !== targetedChannel?.id) return await interaction.deferUpdate();

    if (!member.voice.channel) {
        await interaction.deferUpdate()
        return;
    } else {

        let modal = new ModalBuilder()
            .setCustomId('modal')
            .setTitle(lang.temporary_voice_modal_title);

        modal.addComponents(new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('name')
                    .setLabel(lang.temporary_voice_limit_button_menu_label)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            )
        );

        await interaction.showModal(modal);

        let response = await interaction.awaitModalSubmit({
            filter: (i) => i.customId === 'modal',
            time: 60_000
        });

        let channel = (interaction.member as GuildMember).voice.channel;
        let userLimit = parseInt(response.fields.getField('name').value);

        if (!userLimit) {
            await response.reply({
                content: lang.temporary_voice_limit_button_not_integer
                    .replace("${interaction.client.iHorizon_Emojis.icon.No_Logo}", interaction.client.iHorizon_Emojis.icon.No_Logo)
                ,
                ephemeral: true
            });

            return;
        };

        channel?.setUserLimit(userLimit);

        await response.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(lang.temporary_voice_title_embec)
                    .setColor(2829617)
                    .setFields(
                        {
                            name: lang.temporary_voice_new_userlimit,
                            value: `${interaction.client.iHorizon_Emojis.vc.Limit} **${response.fields.getField('name').value}**`,
                            inline: true
                        },
                    )
                    .setImage(`https://ihorizon.me/assets/img/banner/ihrz_${await interaction.client.db.get(`${interaction.guildId}.GUILD.LANG.lang`) || 'en-US'}.png`)
                    .setFooter(
                        {
                            text: "iHorizon",
                            iconURL: 'attachment://icon.png'
                        }
                    )
            ],
            files: [
                {
                    attachment: await interaction.client.functions.image64(interaction.client.user?.displayAvatarURL()),
                    name: 'icon.png'
                }
            ],
            ephemeral: true
        });
    }
};