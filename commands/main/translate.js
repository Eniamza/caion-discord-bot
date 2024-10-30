const { SlashCommandBuilder } = require('discord.js');
const matchInputToCaionWords = require('../../helpers/matchInputToCaionWords');
const emojiMap = require('../../helpers/letterToEmojiMap.json');
const Translations = require('../../models/Translations');

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
         console.log(`input: ${input}`);
 
         //Filter out all the punctuation marks and special characters and convert the input to lowercase
 
         const filteredInput = input.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
         console.log(`filteredInput: ${filteredInput}`);
         const result = await matchInputToCaionWords(filteredInput);

         console.log(result);
 
         let newString = '';
         let newRawString = '';
 
         result.forEach((word) => {
 
             if (word.type === 'matched') {
                 newRawString += word.caionWords[0] + ' ';
                 let caionWord = word.caionWords[0];
 
                 for (const letter of caionWord) {
                     let greenMap = emojiMap.green
                     newString += greenMap[letter];
                 }
 
                 newString += ' ';
 
             } else {
                 let transformedWord = transformMissingCharacters(word.text);
                 newRawString += transformedWord + ' ';
 
                 for (const letter of transformedWord) {
                     let purpleMap = emojiMap.purple
                     newString += purpleMap[letter];
                 }
 
                 newString += ' ';
             }
 
         });
 
         if (newString.length > 2000) {
            interaction.editReply({ content: `Error: The translated message exceeds the maximum length of 2000 characters.`, ephemeral: true });
            return;
        }

        const newTranslation = await Translations.findOne({ translatedSentence: newRawString.trim() });

        if (!newTranslation) {
     
            await Translations.create({
                translatedSentence: newRawString.trim(),
                originSentence: filteredInput.trim(),
            });

        }

       
        
        console.log(newRawString);
        console.log(newString);
 		await interaction.editReply(newString.trim());
       } catch (error) {

        console.error(error);
        await interaction.editReply({ content: `Error: Fatal error occurred. Contact a moderator.`, ephemeral: true });

        
       }
	},
};