const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'db.db');

module.exports = {
    open() {
        this.Db = new sqlite3.Database(dbPath);
    },
    close() {
        if (this.Db) {
            this.Db.close();
            this.Db = null;
        }
    },
    query(word, callback) {
        if (!this.Db) {
            this.open();
        }
        const sql = `select * from ecdict where word="${word}"`;
        this.Db.all(sql, (err, rows) => {
            if (err) {
                callback(null);
            } else {
                if (rows.length > 0) {
                    callback(rows[0]);
                } else {
                    callback(null);
                }
            }
        });
    }
};
