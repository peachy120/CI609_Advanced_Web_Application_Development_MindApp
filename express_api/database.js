// Load sqlite3
const sqlite3 = require('sqlite').verbose();

const database = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to SQLite Database');

        database.run(`CREATE TABLE tMood (
                        mid         INT PRIMARY KEY AUTO_INCREMENT,
                        date        DATE NOT NULL,
                        time        TIME NOT NULL,
                        weather     VARCHAR(255) NOT NULL,
                        mood        ENUM('HAPPY', 'CALM', 'ANGRY', 'SAD') NOT NULL,
                        comment     LONGTEXT NOT NULL
                     )`,
                    (err) => {
                        if (err) {
                            console.error('Table tMood already exists');
                        } else {
                            console.error('Table tMood created');
                        }
                    });
    }
});
module.exports = db