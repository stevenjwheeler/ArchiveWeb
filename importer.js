const { assert } = require("console");
const fs = require("fs");
const path = require("path");

module.exports = {
  async runImport(archiveName, archiveSourceURL, archiveCookies) {
    /* // run gallery-dl to download the archive and fill the folder
    const { exec } = require("child_process");

    // take each key:value pair in the cookie string and add it to the cookie object

    let cookieObject = {};
    let cookieArray = archiveCookies.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      // remove any spaces at the beginning of the string
      cookieArray[i] = cookieArray[i].trim();

      // split the string into key and value
      let cookie = cookieArray[i].split("=");

      // add the key:value pair to the cookie object
      cookieObject[cookie[0]] = cookie[1];

      // write the cookie object to a txt file
      fs.writeFileSync( path.join(__dirname, "datastructure", archiveName, "cookies.txt"), JSON.stringify(cookieObject));
    }

    //execute gallery-dl and wait for it to finish
    await exec(
      `gallery-dl ${archiveSourceURL} --verbose --write-metadata -o skip=true --destination ./datastructure/${archiveName}/assets --cookies ./datastructure/${archiveName}/cookies.txt`,
      function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
      }
    ); */

    // process all the items in the folders into the database
    // for each item in each folder of assets...
    // 1. check if the item is already in the database
    // 2. if not, add it to the database
    // declare the array of ids
      console.log("running import");
    
    const directory = path.join(
      __dirname,
      "datastructure",
      archiveName + "/assets"
    );
    const database = path.join(
      __dirname,
      "datastructure",
      archiveName + "/archiveDatabase.json"
    );

    // read in the database
    const archiveEntries = JSON.parse(fs.readFileSync(database));

    let folders = fs.readdirSync(directory);
    for (let i = 0; i < folders.length; i++) {
      let item = folders[i];
      let itemPath = directory + "/" + item;
      let files = fs.readdirSync(itemPath);
      for (let j = 0; j < files.length; j++) {
        // get the id of the item from the title, the id is a long string of numbers
        // split the name by the underscore
        let name = files[j].split("_");
        // check through the results for a long string of numbers
        for (let k = 0; k < name.length; k++) {
          if (name[k].length > 16) {
            // check if id is already in archiveEntries
            let id = name[k];
            let idExists = false;
            for (let l = 0; l < archiveEntries.length; l++) {
              if (archiveEntries[l].id === id) {
                idExists = true;
                break;
              }
            }
            // if id is not in archiveEntries, add it
            if (!idExists) {
              archiveEntries.push({
                id: id,
                informationFile: [],
                mediaFiles: [],
              });
            }
            if (files[j].endsWith("main.json")) {
              archiveEntries[archiveEntries.length - 1].informationFile =
                folders[i] + "/" + files[j];
            }
            if (!files[j].endsWith(".json")) {
              if (files[j].includes("_preview")) {
                continue;
              }
              // check if full path is already anywhere in the archiveDatabase
              let pathExists = false;
              for (let l = 0; l < archiveEntries.length; l++) {
                for (let m = 0; m < archiveEntries[l].mediaFiles.length; m++) {
                  if (
                    archiveEntries[l].mediaFiles[m] ===
                    folders[i] + "/" + files[j]
                  ) {
                    pathExists = true;
                    break;
                  }
                }
              }
              if (!pathExists) {
                archiveEntries[archiveEntries.length - 1].mediaFiles.push(
                  folders[i] + "/" + files[j]
                );
              }

              // generate preview images, ignore videos
              if (!files[j].endsWith(".mp4")) {
                // get the file extension
                let split = files[j].split(".");
                // generate the preview image
                let previewImage = split[0] + "_preview." + split[1];
                // check if preview image exists
                if (!fs.existsSync(itemPath + "/" + previewImage)) {
                  // generate the preview image
                  const sharp = require("sharp");
                  sharp(itemPath + "/" + files[j])
                    .resize(300)
                    .toFile(itemPath + "/" + previewImage);
                }
              }
            }
          }
        }
      }
      fs.writeFileSync(database, JSON.stringify(archiveEntries));
    }
  },
};
