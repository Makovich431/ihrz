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
    ApplicationCommandOptionType,
    ApplicationCommandType,
    BaseGuildTextChannel,
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

    name: 'hack',
    name_localizations: {
        "fr": "piratage"
    },

    description: 'Hack a user!',
    description_localizations: {
        "fr": "Pirater un discordiens"
    },

    thinking: true,
    category: 'fun',
    type: "PREFIX_IHORIZON_COMMAND",
    run: async (client: Client, interaction: Message, args: string[]) => {
        let data = await client.functions.getLanguageData(interaction.guildId) as LanguageData;

        let victim = interaction.mentions.users.toJSON()[1] || interaction.guild?.members.cache.random();

        var ip = [
            '1', '100', '168', '254', '345', '128', '256', '255', '0', '144',
            '38', '67', '97', '32', '64', '192', '10', '172', '12', '200', '87',
            '150', '42', '99', '76', '211', '172', '18', '86', '55', '220', '7'
        ];

        var hackerNames = [
            'cyberpunk', 'zeroday', 'blackhat', 'hackmaster', 'shadowbyte', 'crypt0',
            'phishr', 'darknet', 'rootaccess', 'sploit3r', 'hack3rman', 'v1rus',
            'bytebandit', 'malware', 'scriptkiddie'
        ];

        var hackerDomains = [
            'hackmail.com', 'darkweb.net', 'blackhat.org', 'zerodaymail.com',
            'phishmail.net', 'cryptomail.org', 'sploitmail.com', 'hackergang.com',
            'rootmail.org', 'v1rusmail.com'
        ];

        var hackerPasswords = [
            '5up3rP@$$w0rd', 'H4x0r!z3d',
            'N0s3cur1ty', '3vilG3nius', '0bscureC0de', 'Hacker123!', 'P@$$phr4s3',
            'D3c3pt10n', '0v3rwr1t3', 'V1rtu4lInf1ltr4t0r', 'R3v3rse3ng1n33r',
            'C0mpl3xM4tr1x', 'D1g1t4lS3cr3t', 'Myst3ryH4ck', 'Ph4nt0mC0ntrol'
        ];

        function generateRandomNumber() {
            var text = "";
            var possible = "0123456789";
            for (var i = 0; i < 8; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };

        var generatedIp = `${ip[Math.floor(Math.random() * ip.length)]}.${ip[Math.floor(Math.random() * ip.length)]}.${ip[Math.floor(Math.random() * ip.length)]}.${ip[Math.floor(Math.random() * ip.length)]}`;
        var generatedUsername = `${hackerNames[Math.floor(Math.random() * hackerNames.length)]}${generateRandomNumber()}`;
        var generatedEmail = `${generatedUsername}@${hackerDomains[Math.floor(Math.random() * hackerDomains.length)]}`;
        var generatedPassword = hackerPasswords[Math.floor(Math.random() * hackerPasswords.length)];

        let embed = new EmbedBuilder()
            .setColor("#800000")
            .setDescription(data.hack_embed_description
                .replace(/\${victim\.id}/g, victim?.id)
                .replace(/\${interaction\.user\.id}/g, interaction.author.id)
            )
            .addFields({ name: data.hack_embed_fields_ip, value: `\`${generatedIp}\`` },
                { name: data.hack_embed_fields_email, value: `\`${generatedEmail}\`` },
                { name: data.hack_embed_fields_password, value: `\`${generatedPassword}\`` })
            .setTimestamp()

        await interaction.reply({ embeds: [embed] });
        return;
    },
};