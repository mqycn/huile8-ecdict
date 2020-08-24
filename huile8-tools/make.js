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
                        const item = {}
                        if (row.word.toLowerCase() == row.word) {
                            // 大小写不一致
                            item.w = row.word;
                        }
                        if (row.phonetic) {
                            // 存在音标
                            item.p = row.phonetic;
                        }
                        if (Object.keys(item).length == 0) {
                            // 如果 不存在音标且单词不存在大小写，直接存字符串
                            data[row.word.toLowerCase()] = row.translation;
                        } else {
                            // 存在音标或单词存在大小写，增加单词解释
                            item.t = row.translation;
                            data[row.word.toLowerCase()] = item;
                        }
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

