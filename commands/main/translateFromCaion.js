const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Translate from Caion')
    .setType(ApplicationCommandType.Message), // or ApplicationCommandType.MESSAGE
  async execute(interaction, client) {
    const message = interaction.targetMessage
    console.log(message.content);
    interaction.reply({ content: 'This is a placeholder response to the Translate from Caion command.' });
  },
};
