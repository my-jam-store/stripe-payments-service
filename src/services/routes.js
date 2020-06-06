const fs = require('fs')

function init(app, express) {
  app.use(express.urlencoded({ extended: true }))
  setRoutes(app, express)
}

function setRoutes(app, express) {
  fs.readdirSync(srcPath('services/routes')).forEach(route => {
    rootRequire(`services/routes/${route}`).setRoute(app, express)
  })
}

module.exports = {
  init
}
