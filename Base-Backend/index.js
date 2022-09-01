const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jsonParser = bodyParser.json({limit:'50mb'})
// const ejs = require('ejs')
// const path = require('path')
app.use(bodyParser.urlencoded({limit:'50mb',extended:false}))

app.use(jsonParser)
// app.set('views',path.join(__dirname, 'views'))
// app.set('view engine','ejs')
require('./startup/mongodb')()
require('./startup/log')()
try{
 require('./startup/routes')(app);
}catch(e){
    console.log(e.message)
}

const port = process.env.PORT || 4000
app.listen(port,()=>
console.log(`listening on port ${port}`))
