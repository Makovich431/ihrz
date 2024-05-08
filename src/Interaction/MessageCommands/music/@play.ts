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
    time,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';

export const command: Command = {

    name: 'play',

    description: 'Play a song!',
    description_localizations: {
        "fr": "Jouer une musique!"
    },

    options: [
        {
            name: 'title',
            type: ApplicationCommandOptionType.String,

            description: 'The track title you want (you can put URL as you want)',
            description_localizations: {
                "fr": "Titre de la musique (URL si vous le voulez)"
            },

            required: true
        }
    ],
    thinking: true,
    category: 'music',
    type: "PREFIX_IHORIZON_COMMAND",
    run: async (client: Client, interaction: Message, args: string[]) => {
        let data = await client.functions.getLanguageData(interaction.guildId) as LanguageData;

        let voiceChannel = (interaction.member as GuildMember)?.voice.channel;
        let check = args.join(" ");

        if (!voiceChannel) {
            await interaction.reply({ content: data.p_not_in_voice_channel });
            return;
        };

        if (client.functions.isAllowedLinks(check)) {
            return interaction.reply({ content: data.p_not_allowed })
        };

        let player = client.player.createPlayer({
            guildId: interaction.guildId!,
            voiceChannelId: voiceChannel.id,
            textChannelId: interaction.channelId,
        });

        let res = await player.search({ query: check.toString() }, interaction.author)

        if (res.tracks.length === 0) {
            let results = new EmbedBuilder()
                .setTitle(data.p_embed_title)
                .setColor('#ff0000')
                .setTimestamp();

            await interaction.reply({ embeds: [results] });
            return;
        };

        if (!player.connected) {
            await player.connect();
        };

        await player.queue.add(res.tracks[0]);

        if (!player.playing) {
            await player.play();
        };

        let yes = res.tracks[0];

        function timeCalcultator() {
            let totalDurationMs = yes.info.duration
            let totalDurationSec = Math.floor(totalDurationMs! / 1000);
            let hours = Math.floor(totalDurationSec / 3600);
            let minutes = Math.floor((totalDurationSec % 3600) / 60);
            let seconds = totalDurationSec % 60;
            let durationStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            return durationStr;
        };

        let embed = new EmbedBuilder()
            .setDescription(`**${yes.info.title}**`)
            .setColor('#00cc1a')
            .setTimestamp()
            .setFooter({ text: data.p_duration + `${timeCalcultator()}` })
            .setThumbnail(yes.info.artworkUrl as string);

        await interaction.reply({
            content: data.p_loading_message
                .replace("${client.iHorizon_Emojis.icon.Timer}", client.iHorizon_Emojis.icon.Timer)
                .replace("{result}", res.playlist ? 'playlist' : 'track')
            , embeds: [embed]
        });


        await client.db.push(`${player.guildId}.MUSIC_HISTORY.buffer`,
            `[${(new Date()).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}: PLAYED]: { ${res.tracks[0]?.requester} - ${res.tracks[0].info.title} | ${res.tracks[0].info.uri} } by ${res.tracks[0]?.requester}`);
        await client.db.push(`${player.guildId}.MUSIC_HISTORY.embed`,
            `${time(new Date(), 'R')}: ${res.tracks[0]?.requester} - ${res.tracks[0].info.title} | ${res.tracks[0].info.uri} by ${res.tracks[0]?.requester}`
        );

        let channel = client.channels.cache.get(player.textChannelId as string);

        (channel as BaseGuildTextChannel)?.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(2829617)
                    .setDescription(data.event_mp_audioTrackAdd
                        .replace("${client.iHorizon_Emojis.icon.Music_Icon}", client.iHorizon_Emojis.icon.Music_Icon)
                        .replace("${track.title}", res.tracks[0].info.title)
                    )
            ]
        });
        return;
    },
};