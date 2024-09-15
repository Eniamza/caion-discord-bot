// importCaionWords.js
const connectDB = require('../utils/dbConnect');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const CaionWord = require('../models/CaionWord');

// Replace with your MongoDB connection string

// Path to your CSV file
const CSV_FILE_PATH = 'master2.csv';



async function processCSV() {
  const records = [];

  // Read and parse the CSV file
  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv(['meanings', 'caionWord']))
    .on('data', (data) => records.push(data))
    .on('end', async () => {
      for (const record of records) {
        const caionWord = record.caionWord.trim();
        let meanings = record.meanings.trim();

        // Skip empty records
        if (!caionWord || !meanings) continue;

        // Split meanings by '/' and clean up whitespace
        meanings = meanings.split('/').map(m => m.trim());

        // Process each meaning individually
        for (const meaning of meanings) {
          try {
            await processMeaning(caionWord, meaning);
          } catch (err) {
            console.error(`Error processing "${meaning}" for word "${caionWord}":`, err.message);
          }
        }
      }

      // Close the database connection
      mongoose.connection.close();
      console.log('Finished processing CSV file.');
    });
}

async function processMeaning(caionWord, meaning) {
  // Check if the meaning already exists in any Caion word
  const existingMeaning = await CaionWord.findOne({ meanings: meaning });

  if (existingMeaning) {
    if (existingMeaning.caionWord === caionWord) {
      // Meaning already exists for this Caion word
      console.log(`Meaning "${meaning}" already exists for word "${caionWord}".`);
    } else {
      // Meaning exists under a different Caion word
      console.log(`Meaning "${meaning}" already exists under a different word "${existingMeaning.caionWord}".`);
    }
    return;
  }

  // Check if the Caion word already exists
  let caionWordDoc = await CaionWord.findOne({ caionWord });

  if (caionWordDoc) {
    // Add the new meaning to the existing Caion word
    caionWordDoc.meanings.push(meaning);
    await caionWordDoc.save();
    console.log(`Added meaning "${meaning}" to existing word "${caionWord}".`);
  } else {
    // Create a new Caion word with the meaning
    caionWordDoc = new CaionWord({
      caionWord,
      meanings: [meaning],
    });
    await caionWordDoc.save();
    console.log(`Created new word "${caionWord}" with meaning "${meaning}".`);
  }
}

async function main() {
  await connectDB();
  await processCSV();
}

main();
