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
	EmbedBuilder,
	Permissions,
	ApplicationCommandType,
	PermissionsBitField,
	ApplicationCommandOptionType
} = require('discord.js');

module.exports = {
	name: 'morse',
	description: 'Encrypt/decrypt morse',
	options: [
		{
			name: 'input',
			type: ApplicationCommandOptionType.String,
			description: 'Enter your input to encrypt/decrypt in morse',
			required: true
		}
	],
	run: async (client, interaction) => {
		if (!interaction.options.getString("input")) { return interaction.reply({ content: "You have not enter a input to decrypt/encrypt" }) }
		let alpha = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""),
			morse = "/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----".split(","),
			text = interaction.options.getString("input").toUpperCase();
		while (text.includes("Ä") || text.includes("Ö") || text.includes("Ü")) {
			text = text.replace("Ä", "AE").replace("Ö", "OE").replace("Ü", "UE");
		}
		if (text.startsWith(".") || text.startsWith("-")) {
			text = text.split(" ");
			let length = text.length;
			for (i = 0; i < length; i++) {
				text[i] = alpha[morse.indexOf(text[i])];
			}
			text = text.join("");
		} else {
			text = text.split("");
			let length = text.length;
			for (i = 0; i < length; i++) {
				text[i] = morse[alpha.indexOf(text[i])];
			}
			text = text.join(" ");
		}
		return interaction.reply({ content: "```" + text + "```" });
	}
};