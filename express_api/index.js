const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

const index = express();
index.use(bodyParser.urlencoded({
    extend: false
}));

const port = 3000;

// GET Method
index.get('/express_api', async (req, res) => {
    const {status, data} = await getMoods(req);
    res.status(status);
    if (data) res.json(data);
    else      res.end();
})

// POST Method
index.get('/express_api', async (req, res) => {
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
            const sql = 'SELECT date, time, weather, temperature, mood, comment FROM tMood WHERE mid=? ORDER BY time DSC';
            database.all(sql, [mid], (err, rows) => {
                if (!err) {
                    if (rows.length > 0) {
                        status = 200;
                        data = {
                            'mid': mid,
                            'date': date,
                            'time': time,
                            'weather': weather,
                            'temperature': temperature,
                            'mood': mood,
                            'comment': comment
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
        const date = req.body.date;
        const time = req.body.time;
        const weather = req.body.weather;
        const temperature = req.body.temperature;
        const mood = req.body.mood;
        const comment = req.body.comment;

        if (mid && date && time && weather && mood && comment &&
            mid.length > 0 && mid.length <= 32 && mid.match(/^[a-z0-9]+$/i) &&
            comment.length > 0) {
                await new Promise ((resolve, reject) => {
                    const sql = 'INSERT INTO tMood (mid, date, time, weather, temperature, mood, comment) VALUES (?, ?, ?, ?, ?, ?, ?)';

                    // find latestid
                    
                    database.run(sql, [mid, date, time, weather,temperature, mood, comment], function (err, result) {
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