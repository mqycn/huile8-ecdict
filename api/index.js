const db = require('../db');

module.exports = {
    query(word, onFinish) {
        return new Promise((resolve, reject) => {
            db.query(word, (res) => {
                onFinish && onFinish();
                if (!res) {
                    resolve({
                        status: false,
                        word,
                        message: '单词未收录'
                    });
                } else {
                    resolve({
                        status: true,
                        word,
                        phonetic: res.phonetic,
                        translation: res.translation
                    });
                }
            });
        });
    },
    end() {
        db.close();
    },
    one(word) {
        return this.query(word, this.end);
    },
    all(words) {
        return new Promise((resolve, reject) => {
            Promise.all(words.map(word => this.query(word))).then((values) => {
                this.end();
                resolve(values);
            });
        });
    }
};