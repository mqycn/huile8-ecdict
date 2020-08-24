const fs = require('fs');
const path = require('path');
const db = require('../db');
const ora = require('ora');

const keys = 'abcdefghijklmnopqrstuvwxyz'.split('');

const tasks = [];
keys.forEach(w1 => {
    keys.forEach(w2 => {
        tasks.push(`${w1}${w2}`);
    });
});

const taskCount = tasks.length;

const process = ora('分析单词中...').start();
db.open();

(function next() {
    const prefix = tasks.shift();
    if (prefix) {
        db.Db.all(`select * from ecdict where LOWER(word) like "${prefix}%"`, (err, rows) => {
            if (!err && rows.length > 0) {
                const data = {};

                rows.forEach(row => {
                    const item = {}
                    if (row.word.toLowerCase() != row.word) {
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
                fs.writeFileSync(
                    path.join(__dirname, `../../huile8/dictionary/ECDICT/${prefix}.json`),
                    JSON.stringify(data)
                );
            }
        });
        process.text = `分析 ${prefix} 开头的单词中，进度：${(100 - tasks.length * 100 / taskCount).toFixed(2)}%`;
        setTimeout(next, 10); //使用setTImout为了防止阻塞 UI
    } else {
        db.close();
        process.text = '所有单词分析完毕';
        process.succeed();
    }
})();
