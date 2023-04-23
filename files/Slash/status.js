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

var os = require('os-utils');

module.exports = {
    name: 'status',
    description: 'Only for developers !',
    run: async (client, interaction) => {

        const config = require("../config.json")
        if (interaction.user.id != config.ownerid) return interaction.reply(":x: | **You have to be the bot developer to do this!**")
        os.cpuUsage(function (c) {

            const embed = new EmbedBuilder()
                .setColor("#42ff08")
                .addFields(
                    { name: "=====================", value: '**Consumed in real time** :', inline: false },
                    { name: "**CPU USAGE:**", value: 'CPU Usage (%): **' + c + '** %', inline: false },
                    { name: "**RAM USAGE:**", value: 'MEMORY Usage (%): **' + os.freememPercentage() + '** %', inline: false },
                    { name: "=====================", value: '**Characteristic of the server** :', inline: false },
                    { name: "**TOTAL RAM:**", value: 'TOTAL RAM (MB): **' + os.totalmem() + '** MB', inline: false },
                    { name: "**CPU NAME:**", value: '**AMD RYZEN 7 5700G 8 CORE / 12 THREADS 4.6Ghz**', inline: false },
                    { name: "=====================", value: '`iHORIZON`', inline: false }
                )
                .setFooter({ text: 'iHorizon', iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) })

            return interaction.reply({ embeds: [embed] });
        })
        const filter = (interaction) => interaction.user.id === interaction.member.id;
    }
}