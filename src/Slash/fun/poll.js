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

module.exports = {
    name: 'poll',
    description: 'Send a poll to all of the guild !',
    options: [
        {
            name: 'message',
            type: ApplicationCommandOptionType.String,
            description: 'The message showed on the poll',
            required: true
        }
    ],
    run: async (client, interaction) => {
        const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
        let data = await getLanguageData(interaction.guild.id);

        let pollMessage = interaction.options.getString("message")
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: data.poll_not_admin });
        }

        const pollEmbed = new EmbedBuilder()
            .setTitle(data.poll_embed_title
                .replace(/\${interaction\.user\.username}/g, interaction.user.username)
                )
            .setColor("#ddd98b")
            .setDescription(pollMessage)
            .addFields({ name: data.poll_embed_fields_reaction, value: data.poll_embed_fields_choice})
            .setImage("https://cdn.discordapp.com/attachments/610152915063013376/610947097969164310/loading-animation.gif")
            .setTimestamp()

        let msg = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        await msg.react('✅');
        await msg.react('❌');
    }
};