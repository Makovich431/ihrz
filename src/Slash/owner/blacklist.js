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

const {
    Client,
    Intents,
    Collection,
    ChannelType,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} = require('discord.js');

module.exports = {
    name: 'blacklist',
    description: 'Blacklist a user on the bot (must be owner of the bot)',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User,
            description: 'The user you want to blacklist...',
            required: false
        }
    ],
    run: async (client, interaction) => {
        const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
        let data = await getLanguageData(interaction.guild.id);
        
        const { QuickDB } = require("quick.db");
        const db = new QuickDB();

        if (await db.get(`GLOBAL.OWNER.${interaction.user.id}.owner`) !== true) {
            return interaction.reply({ content: data.blacklist_not_owner });
        }

        var text = ""
        const ownerList = await db.all()
        for (var i in ownerList[0].value.BLACKLIST) {
            text += `<@${i}>\n`
        }

        let embed = new EmbedBuilder()
            .setColor('#2E2EFE')
            .setAuthor({ name: 'Blacklist' })
            .setDescription(text || "No blacklist")
            .setFooter({ text: 'iHorizon', iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) })
        const member = interaction.options.getMember('member')
        if (!member) return interaction.reply({ embeds: [embed] });

        if (member.user.id === client.user.id) return interaction.reply({ content: data.blacklist_bot_lol })

        let fetched = await db.get(`GLOBAL.BLACKLIST.${member.user.id}`)

        if (!fetched) {
            await db.set(`GLOBAL.BLACKLIST.${member.user.id}`, { blacklisted: true })
            if (member.bannable) {
                member.ban({ reason: "blacklisted !" })
                return interaction.reply({ content: data.blacklist_command_work.replace(/\${member\.user\.username}/g, member.user.username) });
            } else {
                await db.set(`GLOBAL.BLACKLIST.${member.user.id}`, { blacklisted: true })
                return interaction.reply({ content: data.blacklist_blacklisted_but_can_ban_him })
            }
        } else {
            return interaction.reply({ content: data.blacklist_already_blacklisted.replace(/\${member\.user\.username}/g, member.user.username) });
        }
    }
};