const express = require('express')
const path = require('path')
const fs = require('fs')

module.exports = {
  async webServer () {
    // create an express web server
    const app = express()
    app.set('view engine', 'html')
    app.engine('html', require('ejs').renderFile)
    app.use(express.urlencoded({ extended: true }))
    app.set('views', path.join(__dirname))
    console.log(__dirname)
    const port = 3000

    // get the archive list
    const archiveListPath = path.join(__dirname, 'datastructure', 'archiveList.json')
    const archiveList = JSON.parse(fs.readFileSync(archiveListPath))
    
    app.get('/', (req, res) => {
      res.render('menu.html', {archiveList: archiveList})
    })

    app.get('/archive/:archiveName', (req, res) => {
      const archiveName = req.params.archiveName
      for (let i = 0; i < archiveList.length; i++) {
        if (archiveList[i][0] === archiveName) {
          const archiveDatabasePath = path.join(__dirname, 'datastructure', archiveName, 'archiveDatabase.json')
          const archiveEntries = JSON.parse(fs.readFileSync(archiveDatabasePath))
          res.render('archiveView.html', {archiveName: archiveName, archiveEntries: archiveEntries})
          return
        }
      }
      res.redirect('/')
    })

    app.get('/settings/:option', (req, res) => {
      const option = req.params.option
      if (option === 'menu') {
        res.render('settings/settingsMenu.html')
      }
      if (option === 'createArchive') {
        res.render('settings/createArchive.html', {error: ''})
      }
    })

    app.post('/submit-create', (req, res) => {
      const archiveName = req.body.name
      if (archiveList.includes(archiveName)) {
        res.render('./settings/createArchive', {error: 'Archive name already exists'})
      } else {
        const archiveSource = req.body.source
        const archiveCookies = req.body.cookies
        
        // create the archive list
        archiveList.push([archiveName, archiveSource, archiveCookies])
        fs.writeFileSync(archiveListPath, JSON.stringify(archiveList))

        // create the archive database
        const archiveDir = path.join(__dirname, 'datastructure', archiveName)
        if (!fs.existsSync(archiveDir)) {
          fs.mkdirSync(archiveDir)
          fs.mkdirSync(path.join(archiveDir, 'assets'))
        }
        const archiveDatabasePath = path.join(archiveDir, 'archiveDatabase.json')
        if (!fs.existsSync(archiveDatabasePath)) {
          fs.writeFileSync(archiveDatabasePath, JSON.stringify([]))
        }
        res.redirect('/')
      }
    })

    app.get('*' , (req, res) => {
      res.redirect('/')
    })

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  },

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

module.exports.createFileStructure()
module.exports.webServer()
