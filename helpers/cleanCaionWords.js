const dbConnect = require('../utils/dbConnect');
const CaionWord = require('../models/CaionWord');

async function updateCaionWords() {
    try {
        // Connect to the database
        await dbConnect();
      // Find all documents where 'caionWord' contains a '/'
      const caionWordsWithSlash = await CaionWord.find({ caionWord: /\/+/ });
  
      console.log(`Found ${caionWordsWithSlash.length} documents with '/' in 'caionWord'`);
  
      for (const caionWordDoc of caionWordsWithSlash) {
        const originalCaionWord = caionWordDoc.caionWord;
        
        // Remove everything after the first '/' and trim spaces
        const updatedCaionWord = originalCaionWord.split('/')[0].trim();
  
        // Update the document if the caionWord has changed
        if (updatedCaionWord !== originalCaionWord) {
          caionWordDoc.caionWord = updatedCaionWord;
          await caionWordDoc.save();
          console.log(`Updated 'caionWord' from "${originalCaionWord}" to "${updatedCaionWord}"`);
        }
      }
  
      console.log('Finished updating documents.');
    } catch (err) {
      console.error('Error updating documents:', err);
    } 
  }

    updateCaionWords();