const express = require('express');
const http = require('http');
const path = require('path');
const request = require('request');

// const api = require('./server/routes/api');

const app = express();

app.use('/BAKERY',
    function(req, res) {

        const url = 'https://mmetsa-final-project.herokuapp.com/BAKERY'+req.url;
        var apiResponse = null;

        if(req.method === 'POST') {
            apiResponse = apiResponse = request.post({uri: url, json: req.body});
        } else {
            apiResponse = request(url);
        }

        req.pipe(apiResponse).pipe(res);
    }
);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'dist/index.html'));
});

const port = process.env.PORT || '4100';
app.set('port',port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running`));