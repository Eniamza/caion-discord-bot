const { SlashCommandBuilder } = require('discord.js');

const transformMissingCharacters = (name) => {
    return name
        .replace(/g/g, 'c')
        .replace(/w/g, 'v')
        .replace(/z/g, 's')
        .replace(/k/g, 'c')
        .replace(/q/g, 'cu')
        .replace(/y/g, 'j');
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('Translate English to Caion!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Enter a sentence or a word in English')
                .setRequired(true)),
	async execute(interaction,client) {
        const input = interaction.options.getString('input');

        //Filter out all the punctuation marks and special characters and convert the input to lowercase

        const filteredInput = input.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        const finalInput = transformMissingCharacters(filteredInput);
        const emoji = client.emojis.cache.find(emoji => emoji.name === "b_green");
        console.log(finalInput);


		await interaction.reply(`${emoji}`);
	},
};