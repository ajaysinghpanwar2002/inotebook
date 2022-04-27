// copied this all code from express website

const conectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
conectToMongo();
const app = express()
const port = 5000

app.use(cors())

//here we are using an middleware
app.use(express.json())

//available routes 
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
// link for the application 
app.listen(port, () => {
console.log(`I-Notebook backend listening on port http://localhost:${port}`)
})
