require('dotenv').config()
const app = require('./config/server')
const port = process.env.PORT

app.listen(port, () => console.log(`Rodando na porta ${port}...`))