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
import * as db from '../../core/functions/DatabaseModel';
import logger from '../../core/logger';
import config from '../../files/config';

export const command: Command = {
    name: 'owner',
    description: 'add user to owner list (can\'t be used by normal member)!',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User,
            description: 'The member you want to made owner of the iHorizon Projects',
            required: false
        }
    ],
    category: 'owner',
    run: async (client: Client, interaction: any) => {
        let data = await client.functions.getLanguageData(interaction.guild.id);

        var text = "";
        const ownerList = await db.DataBaseModel({ id: db.All });
        const foundArray = ownerList.findIndex((ownerList: { id: string; }) => ownerList.id === "GLOBAL");
        const char = ownerList[foundArray].value.OWNER;
        for (var i in char) {
            text += `<@${i}>\n`
        }
        if (!text.includes(interaction.user.id)) {
            return interaction.reply({ content: data.owner_not_owner })
        };

        let iconURL:any = client.user?.displayAvatarURL();

        let embed = new EmbedBuilder()
            .setColor("#2E2EFE")
            .setAuthor({ name: "Owners" })
            .setDescription(`${text}`)
            .setFooter({ text: 'iHorizon', iconURL: iconURL })

        let member = interaction.options.getMember('member')
        if (!member) return interaction.reply({ embeds: [embed] });
        let checkAx = await db.DataBaseModel({ id: db.Get, key: `GLOBAL.OWNER.${member.id}.owner` })
        if (!checkAx != true) {
            return interaction.reply({ content: data.owner_already_owner })
        }

        await db.DataBaseModel({ id: db.Set, key: `GLOBAL.OWNER.${member.user.id}.owner`, value: true }),
            interaction.reply({ content: data.owner_is_now_owner.replace(/\${member\.user\.username}/g, member.user.username) });

    },
};