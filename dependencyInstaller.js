const fs = require('fs')

module.exports = {
    installDependencies() {
        // Check the platform
          if (process.platform === "linux") {
              // install python3 if it is not installed
              if (!fs.existsSync('/usr/bin/python3')) {
                console.log('Installing python3...')
                const pythonInstall = spawn('sudo', ['apt', 'install', 'python3', '-y'])
                pythonInstall.stdout.on('data', (data) => {
                  console.log(data.toString())
                })
                pythonInstall.stderr.on('data', (data) => {
                  console.log(data.toString())
                })
                pythonInstall.on('close', (code) => {
                  console.log(`Python3 install exited with code ${code}`)
                })
      
                if (code !== 0) {
                  console.log('Python3 install failed')
                  return
                } else {
                  console.log('Python3 install successful')
                }
              }
      
              // install python3-pip if it is not installed
              if (!fs.existsSync('/usr/bin/pip3')) {
                console.log('Installing python3-pip...')
                const pipInstall = spawn('sudo', ['apt', 'install', 'python3-pip', '-y'])
                pipInstall.stdout.on('data', (data) => {
                  console.log(data.toString())
                })
                pipInstall.stderr.on('data', (data) => {
                  console.log(data.toString())
                })
                pipInstall.on('close', (code) => {
                  console.log(`Python3-pip install exited with code ${code}`)
                })
      
                if (code !== 0) {
                  console.log('Python3-pip install failed')
                  return
                } else {
                  console.log('Python3-pip install successful')
                }
              }
      
              // install python3-venv if it is not installed
              if (!fs.existsSync('/usr/bin/python3-venv')) {
                console.log('Installing python3-venv...')
                const venvInstall = spawn('sudo', ['apt', 'install', 'python3-venv', '-y'])
                venvInstall.stdout.on('data', (data) => {
                  console.log(data.toString())
                })
                venvInstall.stderr.on('data', (data) => {
                  console.log(data.toString())
                })
                venvInstall.on('close', (code) => {
                  console.log(`Python3-venv install exited with code ${code}`)
                })
      
                if (code !== 0) {
                  console.log('Python3-venv install failed')
                  return
                } else {
                  console.log('Python3-venv install successful')
                }
              }
      
              // install gallery-dl if it is not installed
              if (!fs.existsSync('/usr/local/bin/gallery-dl')) {
                  console.log('Installing gallery-dl...')
                  const galleryDlInstall = spawn('sudo', ['pip3', 'install', 'gallery-dl'])
                  galleryDlInstall.stdout.on('data', (data) => {
                  console.log(data.toString())
                  })
                  galleryDlInstall.stderr.on('data', (data) => {
                  console.log(data.toString())
                  })
                  galleryDlInstall.on('close', (code) => {
                  console.log(`Gallery-dl install exited with code ${code}`)
                  })
                  if (code !== 0) {
                    console.log('Gallery-dl install failed')
                    return
                } else {
                    console.log('Gallery-dl install successful')
                }
            }
        } else if (process.platform === "win32") {
            var spawn = require('child_process').spawn;
            var exec = require('child_process').exec;
            var request = require('request');
            
            // install python3 if it is not installed
            exec('python3 -v', (err, stdout, stderr) => {
              if (err || !stdout) {
                // install python3 using npm
                console.log('Python is not installed, installing...')
                const pythonInstaller = spawn('npm', ['install', 'python', '-g'])
                pythonInstaller.stdout.on('data', (data) => {
                    console.log(data.toString())
                })
                pythonInstaller.stderr.on('data', (data) => {
                    console.log(data.toString())
                })
                pythonInstaller.on('close', (code) => {
                    console.log(`Python install exited with code ${code}`)
                    if (code !== 0) {
                        console.log('Python install failed')
                        return
                    } else {
                        console.log('Python install successful')
                    }
                })
              };
            });

            // install pip if it is not installed
            exec('pip -v', (err, stdout, stderr) => {
                if (err || !stdout) {
                    // install pip using npm
                    console.log('Pip is not installed, installing...')
                    const pipInstaller = spawn('npm', ['install', 'pip', '-g'])
                    pipInstaller.stdout.on('data', (data) => {
                        console.log(data.toString())
                    })
                    pipInstaller.stderr.on('data', (data) => {
                        console.log(data.toString())
                    })
                    pipInstaller.on('close', (code) => {
                        console.log(`Pip install exited with code ${code}`)
                        if (code !== 0) {
                            console.log('Pip install failed')
                            return
                        } else {
                            console.log('Pip install successful')
                        }
                    })
                };
            });
            
            // install gallery-dl if it is not installed
            exec('where gallery-dl', (err, stdout, stderr) => {
              if (err || !stdout) {
                console.log('Gallery-dl is not installed, installing...')
                // use pip to install gallery-dl
                const galleryDlInstall = spawn('pip', ['install', 'gallery-dl'])

                galleryDlInstall.stdout.on('data', (data) => {
                  console.log(data.toString())
                })
                galleryDlInstall.stderr.on('data', (data) => {
                  console.log(data.toString())
                })
                galleryDlInstall.on('close', (code) => {
                  console.log(`Gallery-dl install exited with code ${code}`)
                  if (code !== 0) {
                    console.log('Gallery-dl install failed')
                    return
                  } else {
                    console.log('Gallery-dl install successful')
                  }
                })
              };
            });
        } else {
            console.log('Unsupported platform')
        }
    }
}