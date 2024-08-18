const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const port = 3000

app.use(express.static("./app/public"))
app.set("view engine", "ejs")
app.set("views", "./app/views")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const main = require('./app/routes/main')
app.use('/', main)

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`)
})