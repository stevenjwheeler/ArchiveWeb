const fs = require("fs");

module.exports = {
  async installDependencies() {
    const { spawn } = require("child_process");

    try {
      // install python3 if it is not installed
      if (!fs.existsSync("/usr/bin/python3")) {
        console.log("Installing python3...");
        const pythonInstall = spawn("sudo", ["apt", "install", "python3", "-y"]);
        pythonInstall.stdout.on("data", (data) => {
          console.log(data.toString());
        });
        pythonInstall.stderr.on("data", (data) => {
          console.log(data.toString());
        });
        pythonInstall.on("close", (code) => {
          if (code !== 0) {
            console.log("Python3 install failed");
            process.exit(1);
          } else {
            console.log("Python3 install successful");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }

   /*  // install python3-pip if it is not installed
    if (!fs.existsSync("/usr/bin/pip3")) {
      console.log("Installing python3-pip...");
      const pipInstall = spawn("sudo", ["apt", "install", "python3-pip", "-y"]);
      pipInstall.stdout.on("data", (data) => {
        console.log(data.toString());
      });
      pipInstall.stderr.on("data", (data) => {
        console.log(data.toString());
      });
      pipInstall.on("close", (code) => {
        if (code !== 0) {
          console.log("Python3-pip install failed");
          process.exit(1);
        } else {
          console.log("Python3-pip install successful");
        }
      });
    }

    // install python3-venv if it is not installed
    if (!fs.existsSync("/usr/bin/python3-venv")) {
      console.log("Installing python3-venv...");
      const venvInstall = spawn("sudo", [
        "apt",
        "install",
        "python3-venv",
        "-y",
      ]);
      venvInstall.stdout.on("data", (data) => {
        console.log(data.toString());
      });
      venvInstall.stderr.on("data", (data) => {
        console.log(data.toString());
      });
      venvInstall.on("close", (code) => {
        if (code !== 0) {
          console.log("Python3-venv install failed");
          process.exit(1);
        } else {
          console.log("Python3-venv install successful");
        }
      });
    }
 */

    // install gallery-dl if it is not installed
    try {
      if (!fs.existsSync("/usr/local/bin/gallery-dl")) {
        console.log("Installing gallery-dl...");
        const galleryDlInstall = spawn("sudo", ["pip3", "install", "gallery-dl"]);
        galleryDlInstall.stdout.on("data", (data) => {
          console.log(data.toString());
        });
        galleryDlInstall.stderr.on("data", (data) => {
          console.log(data.toString());
        });
        galleryDlInstall.on("close", (code) => {
          if (code !== 0) {
            console.log("Gallery-dl install failed");
            process.exit(1);
          } else {
            console.log("Gallery-dl install successful");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
