const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const letterMap = require('../../helpers/EmojistoLetterMap.json');
const Translations = require('../../models/Translations');

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Translate from Caion')
    .setType(ApplicationCommandType.Message), // or ApplicationCommandType.MESSAGE
  async execute(interaction, client) {
    try {
      const message = interaction.targetMessage
      console.log(message.content);
      let newString = '';
      let spacedSentence = message.content.split(' ');
      console.log(spacedSentence);
      let finalString = ''
      spacedSentence.forEach(phrase => {
  
        const emojis = phrase.match(/<:\w+:\d+>/g) || [];
  
        for (const emojiCode of emojis) {
          if (letterMap[emojiCode]) {
            finalString += letterMap[emojiCode];
          }
    
      }
  
      finalString += ' ';
  
        
      });
      
      console.log(finalString);
  
      const translation = await Translations.findOne({ translatedSentence: finalString.trim() })
  
      if (translation) {
        interaction.reply({ content: `Translation: ${toTitleCase(translation.originSentence)}` });
      }
      else {
        interaction.reply({ content: 'No translation found.' });
      }
  
  
      // interaction.reply({ content: 'This is a placeholder response to the Translate from Caion command.' });
    } catch (error) {

      console.error(error);
      interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      
    }
  },
};
