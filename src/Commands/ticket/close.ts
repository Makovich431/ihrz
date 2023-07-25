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

import {
    Client,
    Collection,
    ChannelType,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} from 'discord.js'

import { Command } from '../../../types/command';
import logger from '../../core/logger';
import config from '../../files/config';

import * as db from '../../core/functions/DatabaseModel';
import * as sourcebin from 'sourcebin';

export const command: Command = {
    name: "close",
    description: "Close a ticket!",
    category: 'ticket',
    run: async (client: Client, interaction: any) => {
        let data = await client.functions.getLanguageData(interaction.guild.id);

        let blockQ = await db.DataBaseModel({ id: db.Get, key: `${interaction.guild.id}.GUILD.TICKET.disable` });
        if (blockQ) { return interaction.reply({ content: data.close_disabled_command }); };

        if (interaction.channel.name.includes('ticket-')) {
            const member = interaction.guild.members.cache.get(interaction.channel.name.split('ticket-').join(''));
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.channel.name === `ticket-${interaction.user.id}`) {
                interaction.channel.messages.fetch().then(async (messages: any[]) => {
                    const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.username}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

                    let response;
                    try {
                        response = await sourcebin.create({
                            title: data.close_title_sourcebin,
                            description: data.close_description_sourcebin,
                            files: [
                                {
                                    content: output,
                                    language: 'text',
                                },
                            ],
                        })

                    } catch (e: any) {
                        return interaction.reply({ content: data.close_error_command });
                    };

                    try {
                        const embed = new EmbedBuilder()
                            .setDescription(`[\`View This\`](${response.url})`)
                            .setColor('#5b92e5');
                        interaction.reply({ content: data.close_command_work_channel, embeds: [embed] })
                    } catch (e: any) {
                        logger.err(e)
                    };

                    try {
                        interaction.channel.permissionOverwrites.create(member.user, { ViewChannel: false, SendMessages: false, ReadMessageHistory: false });
                        interaction.channel.send({ content: data.close_command_work_notify_channel });
                    } catch (e: any) {
                        return interaction.channel.send(data.close_command_error);
                    }
                });
            }
        } else {
            return interaction.reply({ content: data.close_not_in_ticket });
        };
    },
};