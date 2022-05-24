const http = require('http');
const fs = require('fs');
const _= require('lodash');

const server = http.createServer((req,res) => { 
    console.log(req.url,req.method);

    res.setHeader('Content-Type','text/html');

    let path = ''
    switch(req.url){
        case '/':
            path += 'index.html';
            res.statusCode(200);
            break;
        case '/search':
            path += 'search.html';
            res.statusCode(200);
            break;
        default:
            path += 'index.html';
            res.statusCode(404);
            break;
    }

    fs.readFile(path,(err,data) => {
        if(err)
        {
            console.log(err);
        }
        else{
            res.write(data);
            res.end();
        }
    })
});

server.listen(3000,'localhost',() => {
    console.log("listening to port");
});
