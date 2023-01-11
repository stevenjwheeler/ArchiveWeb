const path = require('path')
const fs = require('fs')
const server = require('./server.js')
const dependencyInstallerLinux = require('./dependencyInstaller-Linux.js')
const dependencyInstallerWindows = require('./dependencyInstaller-Windows.js')

module.exports = {
  async createFileStructure() {
    // create the file structure
    const archiveDir = path.join(__dirname, 'datastructure')
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir)
    }
    // create the archive list
    const archiveListPath = path.join(archiveDir, 'archiveList.json')
    if (!fs.existsSync(archiveListPath)) {
      fs.writeFileSync(archiveListPath, JSON.stringify([]))
    }
  }
}

async function main() {
  if (process.platform === "linux") {
    await dependencyInstallerLinux.installDependencies()
  } else if (process.platform === "win32") {
    await dependencyInstallerWindows.installDependencies()
  } else {
    throw new Error("Unsupported platform")
  }
  await module.exports.createFileStructure()
  server.webServer()
}

main()
  .then(() => {
    console.log("Server has started listening on 3000");
  })
  .catch((error) => {
    console.log(error);
    process.exit(2);
  });