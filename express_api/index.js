const express = require('express');
const bodyParser = require('body-parser');
const database = require('./db');

const index = express();
index.use(bodyParser.urlencoded({
    extend: false
}));

const port = 3000;

// GET Method
index.get('/express_api', (req, res) => {
    const {status, data} = await getMoods(req);
    res.status(status);
    if (data) res.json(data);
    else      res.end();
})

// POST Method
index.get('/express_api', (req, res) => {
    const {status, data} = await postMoods(req);
    res.status(status);
    if (data) res.json(data);
    else      res.end();
})

// PUT Method
index.get('/express_api', (req, res) => {
    res.status(405);
    res.end();
})

// DELETE Method
index.get('/express_api', (req, res) => {
    res.status(405);
    res.end();
})

// Async Functions for GET, POST Methods
// GET
async function getMoods(req) {
    
    let status = 500, data = null;

    try {
        const mid = req.query.mid;

        if (mid && mid.length > 0 && mid.length <= 32 && mid.match(/^[a-z0-9]+$/i)) {
            const sql = 'SELECT date, time, weather, mood FROM tMood WHERE userPin=?';
            database.all(sql, [mid], (err, rows) => {
                if (!err) {
                    if (rows.length > 0) {
                        status = 200;
                        data = {
                            'mid': mid,
                            'date': date,
                            'time': time,
                            'weather': weather,
                            'mood': mood
                        };
                    } else {
                        status = 204;
                    }
                }
                resolve();
            });                
        } else {
            status = 400;
        }
    } catch(e) {
        console.error(e);
    }
    return {status, data}
}

//POST
async function postMoods(req) {
    let status = 500, data = null;

    try {
        const mid = req.body.mid;
        const userPin = req.body.userPin;
        const date = req.body.date;
        const time = req.body.time;
        const weather = req.body.weather;
        const mood = req.body.mood;

        if (mid && date && time && weather && mood && 
            mid.length > 0 && mid.length <= 32 && mid.match(/^[a-z0-9]+$/i)) {
                await new Promise ((resolve, reject) => {
                    const sql = 'INSERT INTO tMood (mid, userPin, date, time, weather, mood) VALUES (?, ?, ?, ?, ?, ?)';

                    // find latestid
                    
                    database.run(sql, [mid, userPin, date, time, weather, mood], function (err, result) {
                        if (!err) {
                            status = 201;
                            data = {'mid': this.lastID};
                        }
                        resolve();
                    });
                });
        } else {
            status = 400;
        }
    } catch(e) {
        console.error(e);
    }
    return {status, data};
}

index.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})