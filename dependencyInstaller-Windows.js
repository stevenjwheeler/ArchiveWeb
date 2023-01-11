const fs = require("fs");

module.exports = {
  async installDependencies() {
    const { execSync, exec } = require("child_process");
    const request = require("request");
    const pythonUrl = "https://www.python.org/ftp/python/3.10.0/python-3.10.0-amd64.exe";
    const pythonExe = "python-3.10.0-amd64.exe";

    // install python3 if it is not installed
    try {
      await exec("python -v");
    } catch (err) {
      console.log("Python is not installed, installing...");
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

    try {
      const { stdout } = await exec("pip list");
      if (stdout.includes("gallery-dl")) {
        return;
      } else {
        console.log("Gallery-dl is not installed, installing...");
        // use pip to install gallery-dl
        await execSync("pip install gallery-dl");
        console.log("Gallery-dl install successful");
      }
    } catch (err) {
      console.error("Failed to install gallery-dl: ", err);
      process.exit(1);
    }
  },
};
