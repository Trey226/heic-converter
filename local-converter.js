// converts heic to jpg
// it touches your files

const fs = require('fs').promises;
const path = require('path');
const convert = require('heic-jpg-exif');

// --- STUFF TO CHANGE ---
// folder with your heic files
const FOLDER_PATH = './putPicsHere'; // '.' is this folder

// set to true to delete the original .heic file after converting
// this is permanent.
const DELETE_ORIGINAL = false;
// --- END OF STUFF TO CHANGE ---


/**
 * does the thing
 */
async function processFolder() {
  console.log(`Scanning folder: ${path.resolve(FOLDER_PATH)}`);

  try {
    // make sure the folder exists
    await fs.access(FOLDER_PATH);
  } catch (error) {
    console.error(`Error: The directory "${FOLDER_PATH}" does not exist.`);
    console.log('Please create it or update the FOLDER_PATH variable.');
    return;
  }

  // get all the files
  const files = await fs.readdir(FOLDER_PATH);

  if (files.length === 0) {
    console.log('The folder is empty. Nothing to do.');
    return;
  }

  console.log(`Found ${files.length} files. Looking for .HEIC images...`);

  // loop over the files
  for (const file of files) {
    // only care about .heic files
    if (path.extname(file).toLowerCase() !== '.heic') {
      console.log(`- Skipping "${file}" (not a HEIC file).`);
      continue;
    }

    const heicFilePath = path.join(FOLDER_PATH, file);
    const jpgFileName = `${path.basename(file, path.extname(file))}.jpg`;
    const jpgFilePath = path.join(FOLDER_PATH, jpgFileName);

    console.log(`\n=> Converting "${file}"...`);

    try {
      // convert it
      await convert(heicFilePath, jpgFilePath, 1);
      console.log(`   Success! Saved as "${jpgFileName}"`);

      // delete original if we should
      if (DELETE_ORIGINAL) {
        await fs.unlink(heicFilePath);
        console.log(`   Deleted original file: "${file}"`);
      }
    } catch (error) {
      console.error(`   Failed to convert "${file}":`, error.message);
    }
  }

  console.log('\nProcessing complete.');
}

// run it
processFolder().catch(console.error);