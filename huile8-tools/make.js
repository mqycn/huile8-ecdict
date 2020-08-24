const fs = require('fs');
const path = require('path');
const db = require('../db');

const keys = 'abcdefghijklmnopqrstuvwxyz'.split('');

db.open();
keys.forEach(w1 => {
    keys.forEach(w2 => {
        const prefix = w1 + w2;
        db.Db.all(`select * from ecdict where LOWER(word) like "${prefix}%"`, (err, rows) => {
            console.log(`make: ${prefix}`);
            if (!err) {
                const data = {};
                if (rows.length > 0) {
                    rows.forEach(row => {
                        const item = {
                            w: row.word,
                            t: row.translation
                        }
                        if (row.phonetic) {
                            item.p = row.phonetic
                        }
                        data[row.word.toLowerCase()] = item;
                    });
                }
                fs.writeFileSync(
                    path.join(__dirname, `../../huile8/dictionary/ECDICT/${prefix}.json`),
                    JSON.stringify(data)
                );
            }
        });

    });
});

