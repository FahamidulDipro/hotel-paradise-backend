const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000 || process.env.PORT;

require("dotenv").config;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello From Hotel Paradise');
})

app.listen(port, () => {
  console.log(` listening on port ${port}`)
})