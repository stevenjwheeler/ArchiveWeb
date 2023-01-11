const express = require('express')
const path = require('path')
const fs = require('fs')
const packagejson = require('./package.json')
const importer = require('./importer.js')

module.exports = {
  async webServer () {
    // create an express web server
    const app = express()
    app.set('view engine', 'html')
    app.engine('html', require('ejs').renderFile)
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('views', path.join(__dirname))
    console.log(__dirname)
    const port = 3000

    // get the archive list
    const archiveListPath = path.join(__dirname, 'datastructure', 'archiveList.json')
    const archiveList = JSON.parse(fs.readFileSync(archiveListPath))
    
    // set up the routes for getting pages
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
        res.render('settings/settingsMenu.html', {version: packagejson.version})
      }
      if (option === 'createArchive') {
        res.render('settings/createArchive.html', {error: ''})
      }
      if (option === 'deleteArchive') {
        res.render('settings/deleteArchive.html', {archiveList: archiveList, error : ''})
      }
      if (option === 'renameArchive') {
        res.render('settings/renameArchive.html', {archiveList: archiveList, error : ''})
      }
      if (option === 'changeArchiveSource') {
        res.render('settings/changeArchiveSource.html', {archiveList: archiveList, error : ''})
      }
    })

    app.get('*' , (req, res) => {
      res.redirect('/')
    })

    // set up the routes for posting data
    app.post('/submit-source', (req, res) => {
      const archiveName = req.body.name
      for (let i = 0; i < archiveList.length; i++) {
        if (archiveList[i][0] === archiveName) {
          const newSource = req.body.source
          const cookies = req.body.cookies
          archiveList[i][1] = newSource
          archiveList[i][2] = cookies
          fs.writeFileSync(archiveListPath, JSON.stringify(archiveList))
          res.redirect('/')
          return
        }
      }
      res.render('./settings/changeArchiveSource', {archiveList: archiveList, error: 'Please select an archive to change the source of'})
    })

    app.post('/refresh-archive', (req, res) => {
      const archiveName = req.body.archiveName
      for (let i = 0; i < archiveList.length; i++) {
        if (archiveList[i][0] === archiveName) {
          const archiveSource = archiveList[i][1]
          const cookies = archiveList[i][2]
          const archivePath = path.join(__dirname, 'datastructure', archiveName, 'archiveDatabase.json')
          const archiveDatabase = JSON.parse(fs.readFileSync(archiveDatabasePath))

          // run the importer
          importer.runImport(archiveSource, cookies, archivePath, archiveDatabase);
        }
      }
      res.redirect('/')
    })

    app.post('/submit-rename', (req, res) => {
      const archiveName = req.body.name
      for (let i = 0; i < archiveList.length; i++) {
        if (archiveList[i][0] === archiveName) {
          const newName = req.body.newname
          for (let j = 0; j < archiveList.length; j++) {
            if (archiveList[j][0] === newName) {
              res.render('./settings/renameArchive', {archiveList: archiveList, error: 'New name already exists'})
              return
            }
          }
          // rename the archive in the archive list
          archiveList[i][0] = newName
          fs.writeFileSync(archiveListPath, JSON.stringify(archiveList))
          // rename the archive database
          const archiveDir = path.join(__dirname, 'datastructure', archiveName)
          const newArchiveDir = path.join(__dirname, 'datastructure', newName)
          if (fs.existsSync(archiveDir)) {
            fs.renameSync(archiveDir, newArchiveDir)
          }
          res.redirect('/')
          return
        }
      }
      res.render('./settings/renameArchive', {archiveList: archiveList, error: 'Please select an archive to rename'})
    })

    app.post('/submit-delete', (req, res) => {
      const archiveName = req.body.name
      for (let i = 0; i < archiveList.length; i++) {
        if (archiveList[i][0] === archiveName) {
          // delete the archive from the archive list
          archiveList.splice(i, 1)
          fs.writeFileSync(archiveListPath, JSON.stringify(archiveList))
          // delete the archive database
          const archiveDir = path.join(__dirname, 'datastructure', archiveName)
          if (fs.existsSync(archiveDir)) {
            fs.rmdirSync(archiveDir, {recursive: true})
          }
          res.redirect('/')
          return
        }
      }
      res.render('./settings/deleteArchive', {archiveList: archiveList, error: 'Please select an archive to delete'})
    })

    app.post('/submit-create', (req, res) => {
      const archiveName = req.body.name
      for (let i = 0; i < archiveList.length; i++) {
        if (archiveList[i][0] === archiveName) {
          res.render('./settings/createArchive', {error: 'Archive name already exists'})
          return
        }
      }
      const archiveSource = req.body.source
      const archiveCookies = req.body.cookies
        
      archiveList.push([archiveName, archiveSource, archiveCookies])
      fs.writeFileSync(archiveListPath, JSON.stringify(archiveList))

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
    })

    // start the web server
    app.listen(port)
  }
}