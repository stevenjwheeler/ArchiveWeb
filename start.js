const path = require('path')
const fs = require('fs')
const server = require('./server.js')
const dependencyInstallerLinux = require('./dependencyInstaller-Linux.js')
const dependencyInstallerWindows = require('./dependencyInstaller-Windows.js')

let port = null
process.argv.forEach(function (val, index, array) {
  if (val === '-port' || val === '-p') {
    if (array.length <= index + 1) { console.log('Port is not specified'); process.exit(3) }
    if (isNaN(array[index + 1])) { console.log('Port is not a number'); process.exit(3) }
    if (array[index + 1] < 0) { console.log('Port is negative'); process.exit(3) }
    if (array[index + 1] > 65535) { console.log('Port is too large'); process.exit(3) }
    if (array[index + 1] % 1 !== 0) { console.log('Port is not an integer'); process.exit(3) }
    if (array[index + 1] === 0) { console.log('Port is 0'); process.exit(3) }
    port = array[index + 1]
  }
});

if (port === null) {
  console.log('Port was not specified, using default port 3000')
  port = 3000
}

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
  server.webServer(port)
}

main()
  .then(() => {
    console.log(`Server has started listening on port ${port}`);
  })
  .catch((error) => {
    console.log(error);
    process.exit(2);
  });