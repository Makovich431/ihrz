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
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require(`${process.cwd()}/files/config.js`);

module.exports = {
    name: 'unowner',
    description: 'Remove a owner of the list',
    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User,
            description: 'The member who wants to delete of the owner list',
            required: true
        }
    ],
    run: async (client, interaction) => {
        const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
        let data = await getLanguageData(interaction.guild.id);

        if (await db.get(`GLOBAL.OWNER.${interaction.user.id}.owner`) !== true) {
            return interaction.reply({ content: data.unowner_not_owner });
        }

        let member = interaction.options.getUser('member');

        if (member.id === config.ownerid1 || member.id === config.ownerid2) {
            return interaction.reply({ content: data.unowner_cant_unowner_creator })
        }
        db.delete(`GLOBAL.OWNER.${member.id}`)
        interaction.reply({ content: data.unowner_command_work.replace(/\${member\.username}/g, member.username) })

        const filter = (interaction) => interaction.user.id === interaction.member.id;
    }
}
