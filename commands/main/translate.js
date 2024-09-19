const { SlashCommandBuilder } = require('discord.js');
const matchInputToCaionWords = require('../../helpers/matchInputToCaionWords');
const emojiMap = require('../../helpers/letterToEmojiMap.json');

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
       try {
        await interaction.deferReply();
         const input = interaction.options.getString('input');
         console.log(input);
 
         //Filter out all the punctuation marks and special characters and convert the input to lowercase
 
         const filteredInput = input.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
         const result = await matchInputToCaionWords(filteredInput);
         console.log(result);
 
         let newString = '';
 
         result.forEach((word) => {
 
             if (word.type === 'matched') {
                 let caionWord = word.caionWords[0];
 
                 for (const letter of caionWord) {
                     let greenMap = emojiMap.green
                     newString += greenMap[letter];
                 }
 
                 newString += ' ';
 
             } else {
                 let transformedWord = transformMissingCharacters(word.text);
 
                 for (const letter of transformedWord) {
                     let purpleMap = emojiMap.purple
                     newString += purpleMap[letter];
                 }
 
                 newString += ' ';
             }
 
         });
 
         if (newString.length > 2000) {
            throw new Error('The translated message exceeds the maximum length of 2000 characters.');
        }
 
 
 		await interaction.editReply(newString);
       } catch (error) {

        console.error(error);
        await interaction.editReply({ content: `Error: ${error.message}`, ephemeral: true });
        
       }
	},
};