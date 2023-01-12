const fs = require("fs");
const { execSync, exec, spawnSync } = require("child_process");
const request = require("request");

module.exports = {
  async installDependencies() {
    await this.installPython().then(async () => {
      await this.installGalleryDL();
    });
  },

  async installPython() {
    const pythonUrl =
      "https://www.python.org/ftp/python/3.10.0/python-3.10.0-amd64.exe";
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
    exec("pip list", async (error, stdout, stderr) => {
      if (stdout.includes("gallery-dl")) {
        return;
      } else {
        await new Promise((resolve, reject) => {
          console.log("Gallery-dl is not installed, installing...");
          try {
            execSync("pip install gallery-dl");
          } catch (err) {
            reject(err);
            process.exit(1);
          }
          console.log("Gallery-dl install successful");
          resolve();
        });
      }
    });
  },
};
