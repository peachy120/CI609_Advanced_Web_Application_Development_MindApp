const express = require('express');
const index = express();
const port = 3000;

index.get('/', (req, res) => {
    res.json({'message' : 'ok'})
})

index.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})