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

const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: 'setprofilage',
    description: 'Set your age on the iHorizon Profil !',
    options: [
        {
            name: 'age',
            type: ApplicationCommandOptionType.Number,
            description: 'You age',
            required: true
        }
    ],
    run: async (client, interaction) => {

        var age = interaction.options.getNumber("age")
        if (!age) return interaction.reply(":x: | **Please give a correct syntax.**")


        await db.set(`GLOBAL.USER_PROFIL.${interaction.user.id}.age`, age)
        interaction.reply("**Your profil age has been updated successfully.**")
        const filter = (interaction) => interaction.user.id === interaction.member.id;
    }
}