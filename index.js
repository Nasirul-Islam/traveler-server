const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// username: ${process.env.DB_USER}
// password: ${process.env.DB_PASS}


app.get('/', (req, res) => {
    res.send("Hi I am ready Let's go!")
})

app.listen(port, () => {
    console.log(`My Server listening at http://localhost:${port}`)
})