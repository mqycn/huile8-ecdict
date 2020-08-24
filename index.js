const api = require('./api');

api.one('China').then(data => {
    console.log(data);
});

api.all(['hello', 'world']).then(datas => {
    console.log(datas);
});