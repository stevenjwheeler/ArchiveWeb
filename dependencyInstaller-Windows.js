const fs = require("fs");
const { execSync, exec, spawnSync } = require("child_process");
const request = require("request");

module.exports = {
  async installDependencies() {
    await this.installPython().then(() => { this.installGalleryDL() });
  },

  async installPython() {
    const pythonUrl = "https://www.python.org/ftp/python/3.10.0/python-3.10.0-amd64.exe";
    const pythonExe = "python-3.10.0-amd64.exe";

    try {
      const result = spawnSync("python", ["-v"]);
      if (result.status !== 0) {
        throw new Error("Python is not installed");
      }
    } catch (err) {
      await new Promise((resolve, reject) => {
        console.log("Python is not installed, installing...");
        request(pythonUrl)
          .pipe(fs.createWriteStream(pythonExe))
          .on("close", async () => {
            console.log("Downloaded Python installer");
            console.log("Installing Python...");
            try {
              await execSync(`${pythonExe} /silent PrependPath=1`);
              console.log("Python installed finished");
              resolve();
            } catch (err) {
              reject(err);
              process.exit(1);
            }
          });
      });
    }
  },

  async installGalleryDL() {
    try {
      exec("pip list", (error, stdout, stderr) => {
        if (stderr.includes("gallery-dl")) {
          return;
        } else {
          console.log("Gallery-dl is not installed, installing...");
          execSync("pip install gallery-dl");
          console.log("Gallery-dl install successful");
        }
      });
    } catch (err) {
      console.error("Failed to install gallery-dl: ", err);
      process.exit(1);
    }
  }
};
