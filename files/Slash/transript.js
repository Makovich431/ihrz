const sourcebin = require('sourcebin_js');
const { Client, Intents, Collection, EmbedBuilder, Permissions } = require('discord.js');

module.exports = {
	name: 'transript',
	description: 'transript ticket\'s message',
	run: async (client, interaction) => {

		const { QuickDB } = require("quick.db");
		const db = new QuickDB();
		let blockQ = await db.get(`${interaction.user.id}.GUILD.TICKET.on_or_off`)

		if (blockQ === true) {

			return interaction.reply("You can't use this commands because an Administrator disable the ticket commands !")

		}
		const channel = interaction.channel;
		if (channel.name.includes('ticket-')) {
			if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || channel.name === `ticket-${interaction.user.id}`) {
				channel.messages.fetch().then(async (messages) => {
					const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

					let response;
					try {
						response = await sourcebin.create([
							{
								name: ' ',
								content: output,
								languageId: 'text',
							},
						], {
							title: `Ticket Chat transcript for ${channel.name}`,
							description: ' ',
						});
					}
					catch (e) {
						return interaction.reply('Error occurred, please try again!');
					}

					const embed = new EmbedBuilder()
						.setDescription(`[\`View this\`](${response.url})`)
						.setColor('#0014a8');
					interaction.reply({ embeds: [embed], content: 'You have closed your ticket. iHorizon sent you the transcript' });
				});
			}
		}
		else {
			return interaction.reply(
				'You cannot use this command outside of a ticket channel !',
			);
		}
		const filter = (interaction) => interaction.user.id === interaction.member.id;
	}
}