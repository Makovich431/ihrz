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
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    GuildVoiceChannelResolvable,
    Message,
    User,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';

import Jimp from 'jimp';
import logger from '../../../core/logger.js';
import config from '../../../files/config.js';

export const command: Command = {

    name: 'love',
    name_localizations: {
        "fr": "amour"
    },

    description: 'Show your love compatibilty with the user!',
    description_localizations: {
        "fr": "Montrez votre compatibilité amoureuse avec l'utilisateur"
    },

    options: [
        {
            name: "user1",
            type: ApplicationCommandOptionType.User,

            description: "The user you want to know your love compatibility",
            description_localizations: {
                "fr": "L'utilisateur avec qui vous souhaitez connaître votre compatibilité amoureuse"
            },

            required: false
        },
        {
            name: "user2",
            type: ApplicationCommandOptionType.User,

            description: "The user with whom you want to know love compatibility",
            description_localizations: {
                "fr": "L'utilisateur avec qui vous voulez connaître la compatibilité amoureuse"
            },

            required: false
        }
    ],

    thinking: true,
    category: 'fun',
    type: "PREFIX_IHORIZON_COMMAND",
    run: async (client: Client, interaction: Message, args: string[]) => {
        let data = await client.functions.getLanguageData(interaction.guildId) as LanguageData;

        var user1 = interaction.author;
        var user2 = interaction.mentions.users?.toJSON()[1] || interaction.guild?.members.cache.random()?.user as User;

        let profileImageSize = 512;
        let canvasWidth = profileImageSize * 3;
        let canvasHeight = profileImageSize;

        try {
            let [profileImage1, profileImage2, heartEmoji] = await Promise.all([
                Jimp.read(user1.displayAvatarURL({ extension: 'png', size: 512 })),
                Jimp.read(user2.displayAvatarURL({ extension: 'png', size: 512 })),
                Jimp.read(`${process.cwd()}/src/assets/heart.png`)
            ]);

            profileImage1.resize(profileImageSize, profileImageSize);
            profileImage2.resize(profileImageSize, profileImageSize);
            heartEmoji.resize(profileImageSize, profileImageSize);

            let combinedImage = new Jimp(canvasWidth, canvasHeight);

            combinedImage.blit(profileImage1, 0, 0);
            combinedImage.blit(heartEmoji, profileImageSize, profileImageSize / 2 - heartEmoji.bitmap.height / 2);
            combinedImage.blit(profileImage2, profileImageSize * 2, 1);

            let buffer = await combinedImage.getBufferAsync(Jimp.MIME_PNG);
            let always100: Array<string> = config.command.alway100;

            var found = always100.find(element => {
                if (
                    element === `${user1?.id}x${user2?.id}`
                    ||
                    element === `${user2?.id}x${user1?.id}`
                ) {
                    return true;
                }
                return false;
            });

            var randomNumber: number;
            if (found) {
                randomNumber = 100;
            } else {
                randomNumber = Math.floor(Math.random() * 101);
            }

            var embed = new EmbedBuilder()
                .setColor("#FFC0CB")
                .setTitle("💕")
                .setImage(`attachment://love.png`)
                .setDescription(data.love_embed_description
                    .replace('${user1.username}', user1.username || user1.globalName as string)
                    .replace('${user2.username}', user2?.globalName as string)
                    .replace('${randomNumber}', randomNumber.toString())
                )
                .setFooter({ text: client.user?.username!, iconURL: "attachment://icon.png" })
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                files: [
                    { attachment: buffer, name: 'love.png' },
                    { attachment: await client.functions.image64(client.user?.displayAvatarURL()), name: 'icon.png' }
                ]
            });
        } catch (error: any) {
            logger.err(error);
            await interaction.reply({ content: data.love_command_error });
        }
    },
};