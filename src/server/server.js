let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let server = require('./dbSql')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/data', server)
app.listen(3000, function () {
  console.log('Server is running at http://localhost:3000')
})
